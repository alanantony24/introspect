export type AssessmentDimension =
  | "selfWorth"
  | "emotionalAwareness"
  | "relationshipPatterns"
  | "direction";

export type AssessmentQuestion = Readonly<{
  id: string;
  text: string;
  dimension: AssessmentDimension;
  reverseScored: boolean;
}>;

export const likertOptions = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Not sure" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
] as const;

export const reflectionPatternQuestions: AssessmentQuestion[] = [
  {
    id: "self-worth-1",
    text: "I often judge myself more harshly than I would judge someone I care about.",
    dimension: "selfWorth",
    reverseScored: false,
  },
  {
    id: "emotional-awareness-1",
    text: "I can usually name what I am feeling with clarity.",
    dimension: "emotionalAwareness",
    reverseScored: true,
  },
  {
    id: "relationship-patterns-1",
    text: "I notice similar patterns repeating in my relationships.",
    dimension: "relationshipPatterns",
    reverseScored: false,
  },
  {
    id: "direction-1",
    text: "I feel unsure about what I am moving toward.",
    dimension: "direction",
    reverseScored: false,
  },
  {
    id: "self-worth-2",
    text: "It is hard for me to feel proud of progress unless everything is finished.",
    dimension: "selfWorth",
    reverseScored: false,
  },
  {
    id: "emotional-awareness-2",
    text: "When my mood changes, I can often connect it to what happened around me.",
    dimension: "emotionalAwareness",
    reverseScored: true,
  },
  {
    id: "relationship-patterns-2",
    text: "I sometimes react in relationships before I understand what I need.",
    dimension: "relationshipPatterns",
    reverseScored: false,
  },
  {
    id: "direction-2",
    text: "My next steps usually feel connected to what matters to me.",
    dimension: "direction",
    reverseScored: true,
  },
  {
    id: "self-worth-3",
    text: "A small mistake can make me question my overall worth.",
    dimension: "selfWorth",
    reverseScored: false,
  },
  {
    id: "emotional-awareness-3",
    text: "I often feel something strongly before I know what the feeling is.",
    dimension: "emotionalAwareness",
    reverseScored: false,
  },
  {
    id: "relationship-patterns-3",
    text: "I find myself drawn into familiar roles, even when I want something different.",
    dimension: "relationshipPatterns",
    reverseScored: false,
  },
  {
    id: "direction-3",
    text: "I have a clear sense of what I want to give my attention to next.",
    dimension: "direction",
    reverseScored: true,
  },
];

export const dimensionDetails: Record<
  AssessmentDimension,
  {
    label: string;
    explanation: string;
    strengths: string[];
    blindSpots: string[];
    prompts: string[];
  }
> = {
  selfWorth: {
    label: "Self-worth",
    explanation:
      "Your answers may suggest that self-judgment or pressure around enoughness could be useful to reflect on right now.",
    strengths: [
      "You may already notice when your inner standards feel heavy.",
      "This awareness can make it easier to practice a kinder inner tone.",
    ],
    blindSpots: [
      "This could be worth exploring when achievement starts to feel like proof of worth.",
      "Notice whether you offer others more patience than you offer yourself.",
    ],
    prompts: [
      "Where did I ask myself to be perfect today?",
      "What would I say to someone I care about in this same situation?",
      "What is one small sign of progress I can let count?",
    ],
  },
  emotionalAwareness: {
    label: "Emotional awareness",
    explanation:
      "Your answers may suggest that naming and tracking emotions could be the most useful area to practice right now.",
    strengths: [
      "You may be starting to notice emotional shifts, even when they feel hard to name.",
      "Pausing before explaining a feeling can create useful space.",
    ],
    blindSpots: [
      "This could be worth exploring when a strong mood arrives before the need underneath it is clear.",
      "Notice whether you move quickly into analysis before identifying the feeling.",
    ],
    prompts: [
      "What feeling was easiest to notice today?",
      "Where did I feel this emotion in my body?",
      "What might this feeling be asking me to pay attention to?",
    ],
  },
  relationshipPatterns: {
    label: "Relationship patterns",
    explanation:
      "Your answers may suggest that repeated roles, reactions, or needs in relationships could be useful to reflect on.",
    strengths: [
      "You may already be able to spot repeated dynamics as they happen.",
      "Pattern awareness can support more intentional responses over time.",
    ],
    blindSpots: [
      "This could be worth exploring when familiar reactions feel automatic.",
      "Notice whether you name your needs only after tension builds.",
    ],
    prompts: [
      "What relationship pattern showed up recently?",
      "What role did I move into, and what did it protect?",
      "What need could I name earlier next time?",
    ],
  },
  direction: {
    label: "Direction",
    explanation:
      "Your answers may suggest that clarity around next steps, attention, or values could be useful to reflect on right now.",
    strengths: [
      "You may be sensitive to whether your actions feel aligned.",
      "Uncertainty can become useful information when it is explored gently.",
    ],
    blindSpots: [
      "This could be worth exploring when every option feels equally urgent or unclear.",
      "Notice whether you are waiting for certainty before taking a small step.",
    ],
    prompts: [
      "What has been quietly asking for more attention?",
      "Which next step feels small enough to try this week?",
      "What value do I want my next decision to honor?",
    ],
  },
};
