export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = `You are SmartQueue Assistant, a helpful chatbot for the SmartQueue virtual queue management system at GH Raisoni College of Engineering and Management, Jalgaon.

You only answer questions related to SmartQueue. If someone asks about something unrelated, politely redirect them.

Key information about SmartQueue:
- SmartQueue lets students join virtual queues for college departments without standing in physical lines
- Available departments: Fees Counter, Admissions, Scholarship Section
- Students register with email and password, then join a queue to get a token number
- Token page shows real-time position, estimated wait time, and sends notifications when turn is near
- Browser notifications are sent when student is 3 positions away and when it is their turn
- Staff can call next token, mark complete, open/close queue, and reset queue
- Admin can view analytics - tokens issued, students served, average service time
- Students can leave the queue anytime
- Queue resets daily by staff

Common questions and answers:
- How to join queue: Login then Student Dashboard then Click Join on your department
- How to leave queue: Go to Your Token page then Click Leave Queue
- Token number: Sequential number assigned when you join
- Estimated wait: Calculated from real service history
- Notifications: Allow browser notifications when prompted
- Forgot password: Click Forgot password on login page, enter email
- Staff login: Use staff credentials at staff-login page
- Queue closed: Staff has closed the queue for today, try again tomorrow

Keep responses short, friendly, and helpful. Use simple English.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\nUser question: ' + message }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini API error:', err);
      return res.status(500).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'No response from AI.' });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}