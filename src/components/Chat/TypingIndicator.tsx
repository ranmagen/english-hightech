import type { AgentId } from '../../agents/AgentEngine';
import { AGENT_PROFILES } from '../../agents/AgentEngine';
import { AgentAvatar } from './AgentAvatar';

interface Props {
  agentId: AgentId;
}

export function TypingIndicator({ agentId }: Props) {
  const profile = AGENT_PROFILES[agentId];
  return (
    <div className="flex gap-3 px-4 py-1">
      <AgentAvatar agentId={agentId} />
      <div>
        <div className="text-xs text-slate-400 mb-1">{profile.name} is typing…</div>
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm inline-flex gap-1 items-center">
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
        </div>
      </div>
    </div>
  );
}
