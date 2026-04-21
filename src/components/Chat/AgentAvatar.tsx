import type { AgentId } from '../../agents/AgentEngine';
import { AGENT_PROFILES } from '../../agents/AgentEngine';

interface Props {
  agentId: AgentId;
  size?: 'sm' | 'md';
}

export function AgentAvatar({ agentId, size = 'md' }: Props) {
  const profile = AGENT_PROFILES[agentId];
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${sizeClass} ${profile.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {profile.avatar}
    </div>
  );
}
