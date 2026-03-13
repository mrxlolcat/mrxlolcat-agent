import { describe, it, expect } from 'vitest';
import { getSystemPrompt } from '../src/agent/core/brain';

describe('MRX LOLCAT Skills Test', () => {
  
  it('core: should have the master identity in prompt', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('MRX LOLCAT');
    expect(prompt).toContain('ERC-8004');
  });

  it('skill: bridge-skill should be declared in MCP section', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('bridge-skill');
    expect(prompt).toContain('LI.FI');
  });

  it('skill: monitor-skill should be declared in MCP section', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('monitor-skill');
    expect(prompt).toContain('wallet tracking');
  });

  it('skill: social-skill should be declared in MCP section', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('social-skill');
    expect(prompt).toContain('Farcaster');
  });

  it('context: should inject wallet address into instructions', () => {
    const addr = '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5';
    const prompt = getSystemPrompt('cats', addr);
    expect(prompt).toContain(addr);
  });

});
