import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Clock, Play, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Message, AgentId } from '../../agents/AgentEngine';
import { sendAgentMessage } from '../../agents/AgentEngine';
import type { ScenarioState } from '../../scenarios/ScenarioEngine';
import { updateScenarioState } from '../../scenarios/ScenarioEngine';
import { MessageBubble } from '../Chat/MessageBubble';
import { TypingIndicator } from '../Chat/TypingIndicator';

interface Slide {
  id: string;
  title: string;
  bullets: string[];
}

interface Props {
  scenarioState: ScenarioState;
  onStateUpdate: (state: ScenarioState) => void;
  onPresentationComplete: (state: ScenarioState) => void;
}

const PRESENTATION_SECONDS = 5 * 60;

export function PresentationMode({ scenarioState, onStateUpdate, onPresentationComplete }: Props) {
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', title: 'Introduction', bullets: ['', '', ''] },
    { id: '2', title: 'The Problem', bullets: ['', '', ''] },
    { id: '3', title: 'Our Solution', bullets: ['', '', ''] },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState<'build' | 'present' | 'qa'>('build');
  const [timeLeft, setTimeLeft] = useState(PRESENTATION_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [qaMessages, setQaMessages] = useState<Message[]>([]);
  const [qaInput, setQaInput] = useState('');
  const [typingAgents, setTypingAgents] = useState<AgentId[]>([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          startQaPhase();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaMessages, typingAgents]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addSlide = () => {
    const newSlide: Slide = { id: Date.now().toString(), title: 'New Slide', bullets: ['', '', ''] };
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlide(slides.length);
  };

  const removeSlide = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id));
    setCurrentSlide(Math.max(0, currentSlide - 1));
  };

  const updateSlide = (id: string, field: 'title' | 'bullets', value: string | string[]) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const startPresentation = () => {
    setPhase('present');
    setTimerActive(true);
  };

  const startQaPhase = () => {
    setPhase('qa');
    const openingMsg: Message = {
      role: 'assistant',
      content: "Thank you for the presentation. We have a few questions. Let's start: What's your projected ROI for enterprise clients in the first 6 months, and how did you arrive at that number?",
      agentId: scenarioState.scenario.agents[0],
      timestamp: Date.now(),
    };
    setQaMessages([openingMsg]);
    setQuestionsAsked(1);
  };

  const handleQaSubmit = async () => {
    if (!qaInput.trim() || qaLoading) return;

    const userMsg: Message = { role: 'user', content: qaInput.trim(), timestamp: Date.now() };
    setQaMessages(prev => [...prev, userMsg]);
    setQaInput('');
    setQaLoading(true);

    const agentId = scenarioState.scenario.agents[questionsAsked % scenarioState.scenario.agents.length];
    setTypingAgents([agentId]);

    await new Promise(res => setTimeout(res, 1200));

    try {
      const slideSummary = slides.map(s => `${s.title}: ${s.bullets.filter(Boolean).join(', ')}`).join(' | ');
      const response = await sendAgentMessage(
        agentId,
        `[PRESENTATION Q&A - Student just answered a question about their pitch. Their slides covered: ${slideSummary}] Student's answer: ${qaInput.trim()}`,
        qaMessages,
        {
          scenarioId: scenarioState.scenario.id,
          scenarioTitle: scenarioState.scenario.title,
          goal: scenarioState.scenario.goal,
        }
      );

      const newQuestionsAsked = questionsAsked + 1;
      setQuestionsAsked(newQuestionsAsked);

      let followUp = '';
      if (newQuestionsAsked === 2) followUp = " I have one more question: What's your go-to-market strategy for the first 50 enterprise clients?";
      if (newQuestionsAsked >= 3) followUp = " Thank you. That concludes our questions.";

      const agentMsg: Message = {
        role: 'assistant',
        content: response.message + followUp,
        agentId,
        timestamp: Date.now(),
      };

      setQaMessages(prev => [...prev, agentMsg]);
      setTypingAgents([]);
      setQaLoading(false);

      const updatedState = updateScenarioState(
        scenarioState,
        [userMsg, agentMsg],
        response.vocabularyUsed,
        response.agentSatisfaction
      );
      onStateUpdate(updatedState);

      if (newQuestionsAsked >= 3) {
        setTimeout(() => {
          onPresentationComplete({ ...updatedState, isComplete: true, goalAchieved: true });
        }, 2000);
      }
    } catch {
      setTypingAgents([]);
      setQaLoading(false);
    }
  };

  const slide = slides[currentSlide];

  if (phase === 'build') {
    return (
      <div className="h-full flex">
        {/* Slide list */}
        <div className="w-48 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-3 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Slides</p>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(i)}
              className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                i === currentSlide ? 'bg-sky-100 text-sky-700 font-semibold border border-sky-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {i + 1}. {s.title || 'Untitled'}
            </button>
          ))}
          <button
            onClick={addSlide}
            className="w-full flex items-center gap-1 p-2 text-xs text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <Plus size={12} /> Add slide
          </button>
        </div>

        {/* Slide editor */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700">Build Your Presentation</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{slides.length} slides</span>
              <button
                onClick={startPresentation}
                disabled={slides.length < 2}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Play size={14} /> Start Presentation
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <input
                value={slide.title}
                onChange={e => updateSlide(slide.id, 'title', e.target.value)}
                placeholder="Slide title…"
                className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-sky-500 outline-none w-full pb-1 bg-transparent"
              />
              {slides.length > 1 && (
                <button onClick={() => removeSlide(slide.id)} className="text-red-400 hover:text-red-600 ml-4">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {slide.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sky-400 mt-2.5">•</span>
                  <input
                    value={bullet}
                    onChange={e => {
                      const updated = [...slide.bullets];
                      updated[i] = e.target.value;
                      updateSlide(slide.id, 'bullets', updated);
                    }}
                    placeholder={`Point ${i + 1}…`}
                    className="flex-1 border-b border-slate-200 focus:border-sky-400 outline-none py-1 text-slate-700 bg-transparent text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => updateSlide(slide.id, 'bullets', [...slide.bullets, ''])}
                className="text-xs text-slate-400 hover:text-sky-600 flex items-center gap-1"
              >
                <Plus size={11} /> Add bullet
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-slate-500">{currentSlide + 1} / {slides.length}</span>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'present') {
    return (
      <div className="h-full flex flex-col">
        <div className={`px-6 py-3 border-b flex items-center justify-between ${timeLeft < 60 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Clock size={16} className={timeLeft < 60 ? 'text-red-500' : 'text-sky-600'} />
            <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
              {formatTime(timeLeft)}
            </span>
            {timeLeft < 60 && <span className="text-xs text-red-500 animate-pulse">Almost done!</span>}
          </div>
          <div className="text-sm text-slate-500">Slide {currentSlide + 1} of {slides.length}</div>
          <button
            onClick={startQaPhase}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium"
          >
            <MessageSquare size={14} className="inline mr-1" />
            Done — Start Q&A
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center bg-slate-900 p-12">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-slate-400 text-sm mb-6 font-medium uppercase tracking-widest">
              {scenarioState.scenario.title}
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-8">{slides[currentSlide].title}</h2>
            <ul className="space-y-4 text-left max-w-lg mx-auto">
              {slides[currentSlide].bullets.filter(Boolean).map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-xl text-slate-700">
                  <span className="text-sky-500 font-bold">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-800 px-6 py-3 flex justify-center gap-4">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-slate-600 hover:bg-slate-400'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="text-slate-400 hover:text-white disabled:opacity-30 p-2"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Q&A phase
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3">
        <MessageSquare size={16} className="text-sky-600" />
        <span className="font-semibold text-slate-700">Live Q&A — Answer the panel's questions</span>
        <span className="text-xs text-slate-400 ml-auto">{questionsAsked}/3 questions</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1 bg-white scrollbar-thin">
        {qaMessages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {typingAgents.map(id => <TypingIndicator key={id} agentId={id} />)}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-3 items-end">
          <textarea
            value={qaInput}
            onChange={e => setQaInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQaSubmit(); } }}
            placeholder="Answer the question… (Enter to send)"
            rows={3}
            disabled={qaLoading || questionsAsked >= 3}
            className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            onClick={handleQaSubmit}
            disabled={!qaInput.trim() || qaLoading || questionsAsked >= 3}
            className="w-10 h-10 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
