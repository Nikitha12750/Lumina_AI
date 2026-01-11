const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @route   POST api/generate
// @desc    Generate AI content
// @access  Private
router.post('/', auth, async (req, res) => {
    const { prompt, contentType, tone } = req.body;

    if (!prompt || !contentType || !tone) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Credit Check
        if (user.credits <= 0) {
            return res.status(403).json({ msg: 'Insufficient credits. Please upgrade or contact support.' });
        }

        // ✅ BUILD PROMPT FIRST
        const finalPrompt = `Generate a ${tone} ${contentType} about "${prompt}". Keep it concise and engaging.`;

        let aiResponse = '';

        // 🤖 AI Generation Logic
        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

                const model = genAI.getGenerativeModel({
                    model: "gemini-flash-latest",
                });

                const result = await model.generateContent(finalPrompt);
                aiResponse = result.response.text();

            } catch (error) {
                console.error("Gemini API Error:", error);
                return res.status(500).json({ msg: 'AI Generation failed' });
            }

        } else {
            // 🧪 Mock Mode
            console.log('Using Mock AI Mode');
            await new Promise(resolve => setTimeout(resolve, 2000));
            aiResponse = `[MOCK AI] Here is a ${tone} ${contentType} about "${prompt}". This is a simulated response because no API key was provided.`;
        }

        // 💾 Persist Data & Update Credits
        user.credits -= 1;

        user.history.unshift({
            prompt,
            contentType,
            tone,
            response: aiResponse,
            createdAt: new Date()
        });

        await user.save();

        res.json({
            response: aiResponse,
            credits: user.credits,
            history: user.history
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
