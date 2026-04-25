/**
 * Emotion & sentiment analysis — fully local, no API key needed.
 * Uses keyword-based scoring weighted against the star rating.
 */

const POSITIVE_WORDS = [
  'love','excellent','amazing','great','fantastic','wonderful','awesome','perfect',
  'brilliant','outstanding','superb','impressive','beautiful','best','happy',
  'pleased','satisfied','enjoy','enjoyed','smooth','easy','intuitive','clean',
  'polished','helpful','fast','quick','efficient','recommend','good','nice',
  'solid','useful','clear','simple','convenient','reliable','responsive',
  'stunning','delightful','incredible','exceptional','well done','thank',
  'thanks','appreciate','appreciated','glad','positive','love it','works well',
  'no issues','no problem','no complaints','very good','very nice','very happy',
];

const NEGATIVE_WORDS = [
  'bad','terrible','awful','horrible','worst','hate','broken','crash','crashed',
  'bug','error','fail','failed','failure','slow','frustrating','frustrated',
  'disappointed','disappointing','unusable','confusing','confused','lost',
  'stuck','useless','waste','wasted','poor','missing','missing out','annoying',
  'annoyed','difficult','hard','problem','problems','issue','issues','wrong',
  'incorrect','not working','doesnt work','does not work','cant','cannot',
  'unacceptable','missed','never','nothing','nowhere','unclear','laggy','lag',
  'glitch','glitches','loading','forever','timeout','lost my','lost the',
];

const EMOTION_KEYWORDS = {
  joy:            ['love','happy','happiness','joy','delighted','excited','great','wonderful','amazing','fantastic','enjoy','glad','pleased','thrilled'],
  satisfaction:   ['satisfied','smooth','easy','works','helpful','useful','convenient','reliable','efficient','clear','simple','good','nice','fine'],
  frustration:    ['frustrated','frustrating','annoying','annoyed','stuck','hard','difficult','confusing','confused','cant','cannot','slow','laggy','lag'],
  disappointment: ['disappointed','disappointing','expected','let down','missing','missed','worse','bad','poor','not what','unfortunately','sadly','waste'],
  enthusiasm:     ['amazing','incredible','awesome','love','best','outstanding','brilliant','superb','exceptional','highly recommend','excellent','wow'],
};

function countKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(w => lower.includes(w)).length;
}

function analyzeText(text) {
  const posCount = countKeywords(text, POSITIVE_WORDS);
  const negCount = countKeywords(text, NEGATIVE_WORDS);
  const total    = posCount + negCount || 1;

  const textScore = Math.round((posCount / total) * 100);
  return { posCount, negCount, textScore };
}

function calcEmotions(text) {
  const emotions = {};
  let maxScore = 0;
  let dominant = 'satisfaction';

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    const hits  = countKeywords(text, keywords);
    const score = Math.min(100, hits * 20);
    emotions[emotion] = score;
    if (score > maxScore) { maxScore = score; dominant = emotion; }
  }

  // Ensure at least one emotion has a value based on overall sentiment
  if (maxScore === 0) {
    emotions.satisfaction = 30;
    dominant = 'satisfaction';
  }

  return { emotions, dominantEmotion: dominant };
}

function buildSummary(sentiment, dominantEmotion, score) {
  if (score >= 75) {
    return `User expresses strong ${dominantEmotion} with a highly positive emotional tone.`;
  } else if (score >= 50) {
    return `User shows moderate positivity with ${dominantEmotion} as the dominant emotion.`;
  } else if (score >= 30) {
    return `Mixed signals detected — ${dominantEmotion} is present alongside some dissatisfaction.`;
  } else {
    return `User feedback carries a notably negative tone, dominated by ${dominantEmotion}.`;
  }
}

/**
 * Main export — analyzes feedback text + star rating.
 * Returns { score, sentiment, emotions, dominantEmotion, summary, recommendation }
 */
async function analyzeFeedbackEmotion(feedbackText, rating) {
  const text = String(feedbackText).toLowerCase();

  // Text-based score (0-100)
  const { textScore } = analyzeText(text);

  // Rating-based score (1-5 → 0-100)
  const ratingScore = Math.round(((rating - 1) / 4) * 100);

  // Weighted blend: 55% text analysis + 45% star rating
  const score = Math.round(textScore * 0.55 + ratingScore * 0.45);

  // Sentiment label
  let sentiment;
  if (score >= 65)      sentiment = 'positive';
  else if (score >= 40) sentiment = 'neutral';
  else                  sentiment = 'negative';

  // Emotions
  const { emotions, dominantEmotion } = calcEmotions(text);

  // Adjust dominant emotion based on sentiment if no keywords matched
  if (emotions[dominantEmotion] === 0 || Object.values(emotions).every(v => v === 0)) {
    if (sentiment === 'positive') {
      emotions.joy = 60; emotions.satisfaction = 50;
    } else if (sentiment === 'negative') {
      emotions.frustration = 60; emotions.disappointment = 50;
    } else {
      emotions.satisfaction = 40;
    }
  }

  const summary        = buildSummary(sentiment, dominantEmotion, score);
  const recommendation = score >= 50 ? 'positive' : 'negative';

  return { score, sentiment, emotions, dominantEmotion, summary, recommendation };
}

module.exports = { analyzeFeedbackEmotion };