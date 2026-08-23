export const STEP_LABEL: Record<string, string> = {
  SELECT_CONSENSUS_GROUP:           'Select Consensus Group',
  AWAIT_PROPOSAL:                   'Await Proposal',
  COLLECT_VOTES:                    'Collect Votes',
  AWAIT_AGGREGATED_VOTES:           'Await Aggregated Votes',
  COLLECT_EXECUTION_RESULTS:        'Collect Execution Results',
  AWAIT_ANSWER_EVIDENCE:            'Await Answer Evidence',
  JUDGE_ANSWERS:                    'Judge Answers',
  COLLECT_CLASSIFICATION_VOTES:     'Collect Classification Votes',
  AWAIT_CLASSIFICATION_CERTIFICATE: 'Await Classification Certificate',
  SYNTHESIZE_ANSWERS:               'Synthesize Answers',
  COLLECT_SYNTHESIS_VOTES:          'Collect Synthesis Votes',
  AWAIT_PROPOSED_SYNTHESIS:         'Await Proposed Synthesis',
  AWAIT_AGGREGATED_SYNTHESIS_VOTES: 'Await Aggregated Synthesis Votes',
  FINISHED:                         'Finished',
  FAILED:                           'Failed',
  IDLE:                             'Idle',
}

// Keys are 1-indexed display labels (MR1=1, MR2=2, MR3=3).
// API returns 0-indexed mini_round; add 1 before using these.
export const MR_STEPS: Record<number, string[]> = {
  1: [
    'SELECT_CONSENSUS_GROUP',
    'AWAIT_PROPOSAL',
    'COLLECT_VOTES',
    'AWAIT_AGGREGATED_VOTES',
  ],
  2: [
    'SELECT_CONSENSUS_GROUP',
    'COLLECT_EXECUTION_RESULTS',
    'AWAIT_ANSWER_EVIDENCE',
    'JUDGE_ANSWERS',
    'COLLECT_CLASSIFICATION_VOTES',
    'AWAIT_CLASSIFICATION_CERTIFICATE',
  ],
  3: [
    'SELECT_CONSENSUS_GROUP',
    'SYNTHESIZE_ANSWERS',
    'COLLECT_SYNTHESIS_VOTES',
    'AWAIT_PROPOSED_SYNTHESIS',
    'AWAIT_AGGREGATED_SYNTHESIS_VOTES',
  ],
}
