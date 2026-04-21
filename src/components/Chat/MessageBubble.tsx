import type { Message } from '../../agents/AgentEngine';
import type { AgentId } from '../../agents/AgentEngine';
import { AGENT_PROFILES } from '../../agents/AgentEngine';
import { AgentAvatar } from './AgentAvatar';
import { GlossaryTooltip } from '../GlossaryTooltip/GlossaryTooltip';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="message-enter flex justify-end gap-3 px-4 py-1">
        <div className="max-w-[70%]">
          <div className="text-right text-xs text-slate-400 mb-1">You · {time}</div>
          <div className="bg-sky-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
            <GlossaryTooltip text={message.content} />
          </div>
        </div>
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          PM
        </div>
      </div>
    );
  }

  const agentId = message.agentId as AgentId;
  const profile = agentId ? AGENT_PROFILES[agentId] : null;

  return (
    <div className="message-enter flex gap-3 px-4 py-1">
      {agentId && <AgentAvatar agentId={agentId} />}
      <div className="max-w-[70%]">
        {profile && (
          <div className="text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">{profile.name}</span>
            <span className="mx-1">·</span>
            <span>{profile.role}</span>
            {time && <span className="ml-1">· {time}</span>}
          </div>
        )}
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">
          <GlossaryTooltip text={message.content} />
        </div>
      </div>
    </div>
  );
}
