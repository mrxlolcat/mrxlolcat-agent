import { describe, it, expect } from 'vitest';
import { getSystemPrompt } from '../src/agent/core/brain';

describe('Agent Core', () => {
  it('should generate a system prompt containing the agent name', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('MRX LOLCAT');
  });

  it('should include wallet context when address is provided', () => {
    const address = '0x123';
    const prompt = getSystemPrompt('cats', address);
    expect(prompt).toContain(address);
  });
});
