import { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, CheckCircle } from 'lucide-react';
import type { Message, AgentId } from '../../agents/AgentEngine';
import { sendAgentMessage, AGENT_PROFILES } from '../../agents/AgentEngine';
import type { ScenarioState } from '../../scenarios/ScenarioEngine';
import { updateScenarioState, checkGoalAchieved, getComplexityBonus } from '../../scenarios/ScenarioEngine';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { VocabularyTracker } from './VocabularyTracker';
import { AgentAvatar } from './AgentAvatar';

interface Props {
  scenarioState: ScenarioState;
  onStateUpdate: (state: ScenarioState) => void;
  onComplete: (state: ScenarioState) => void;
}

export function ChatInterface({ scenarioState, onStateUpdate, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [typingAgents, setTypingAgents] = useState<AgentId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { scenario, messages, vocabularyUsed } = scenarioState;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingAgents]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const newMessages: Message[] = [userMessage];
    let currentState = updateScenarioState(scenarioState, [userMessage], [], 0);
    onStateUpdate(currentState);
    setInput('');
    setIsLoading(true);

    const respondingAgents = scenario.agents.slice(0, scenario.agents.length > 2 ? 2 : scenario.agents.length);

    for (const agentId of respondingAgents) {
      setTypingAgents(prev => [...prev, agentId]);

      await new Promise(res => setTimeout(res, 800 + Math.random() * 1200));

      try {
        const response = await sendAgentMessage(agentId, input.trim(), messages, {
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          goal: scenario.goal,
          contextDoc: scenario.context_doc || undefined,
        });

        const agentMessage: Message = {
          role: 'assistant',
          content: response.message,
          agentId,
          timestamp: Date.now(),
        };

        newMessages.push(agentMessage);
        currentState = updateScenarioState(
          currentState,
          [agentMessage],
          response.vocabularyUsed,
          response.agentSatisfaction
        );
        onStateUpdate(currentState);
      } catch (err) {
        console.error('Agent response error:', err);
      }

      setTypingAgents(prev => prev.filter(id => id !== agentId));
    }

    setIsLoading(false);

    if (checkGoalAchieved(currentState)) {
      const finalState = {
        ...currentState,
        isComplete: true,
        goalAchieved: true,
        complexityBonusEarned: getComplexityBonus(currentState),
      };
      setTimeout(() => onComplete(finalState), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHint = () => {
    setShowHint(true);
    if (!hintUsed) setHintUsed(true);
  };

  return (
    <div className="flex h-full gap-0">
      {/* Left panel: scenario briefing */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${
            scenario.level === 'beginner' ? 'bg-green-100 text-green-700' :
            scenario.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {scenario.level.charAt(0).toUpperCase() + scenario.level.slice(1)}
          </div>
          <h2 className="font-bold text-slate-800 text-base">{scenario.title}</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{scenario.goal}</p>
        </div>

        {scenario.context_doc && (
          <div className="p-4 border-b border-slate-200 flex-1 overflow-y-auto scrollbar-thin">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Context Document</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-mono bg-white border border-slate-200 rounded p-3">
              {scenario.context_doc}
            </div>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Team</h3>
          <div className="space-y-2">
            {scenario.agents.map(agentId => (
              <div key={agentId} className="flex items-center gap-2">
                <AgentAvatar agentId={agentId} size="sm" />
                <div>
                  <div className="text-xs font-semibold text-slate-700">{AGENT_PROFILES[agentId].name}</div>
                  <div className="text-xs text-slate-400">{AGENT_PROFILES[agentId].role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-semibold text-slate-700">#{scenario.id.toLowerCase()} — {scenario.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {checkGoalAchieved(scenarioState) && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <CheckCircle size={14} />
                Goal achieved!
              </div>
            )}
            <button
              onClick={handleHint}
              className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <Lightbulb size={13} />
              {hintUsed ? 'Show hint' : 'Need a hint?'}
            </button>
          </div>
        </div>

        {showHint && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <span className="font-semibold">Hint: </span>{scenario.hint}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin bg-white">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {typingAgents.map(agentId => (
            <TypingIndicator key={agentId} agentId={agentId} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={3}
              className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {input.length > 0 && `${input.length} characters · `}
            Press Enter to send
          </div>
        </div>
      </div>

      {/* Right panel: vocabulary tracker */}
      <div className="w-64 flex-shrink-0 border-l border-slate-200 bg-white">
        <VocabularyTracker usedTerms={vocabularyUsed} />
      </div>
    </div>
  );
}
