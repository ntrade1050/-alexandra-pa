exports.handler = async function(event, context) {
  if(event.httpMethod !== 'POST') {
    return {statusCode:405, body:'Method not allowed'};
  }

  const API_KEY = 'sk_ade9bf17b7d4d1dde09b5b2ef891ee63dbe52ddb4ad5cee7';
  const VOICE_ID = 'uhYnkYTBc711oAY590Ea';

  try {
    const body = JSON.parse(event.body);
    const text = body.text || '';

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    );

    if(!response.ok) {
      return {statusCode: response.status, body: 'ElevenLabs API error'};
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      },
      body: base64Audio,
      isBase64Encoded: true
    };
  } catch(err) {
    console.error('Function error:', err);
    return {statusCode: 500, body: 'Internal error: ' + err.message};
  }
};
