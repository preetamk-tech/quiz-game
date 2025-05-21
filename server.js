const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
const upload = multer({ dest: 'uploads/' });

const GITHUB_TOKEN = 'your_github_token'; // Replace with your GitHub token
const GITHUB_REPO = 'yourusername/yourrepo'; // Replace with your repo
const FILE_PATH_IN_REPO = 'questions.txt';

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const content = fs.readFileSync(file.path, 'utf8');
  const encodedContent = Buffer.from(content).toString('base64');

  try {
    const { data: currentFile } = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`,
      {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    );

    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`,
      {
        message: 'Update questions.txt via upload',
        content: encodedContent,
        sha: currentFile.sha,
      },
      {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    );
    res.send({ status: 'Updated on GitHub' });

  } catch (err) {
    // First-time upload if file doesn't exist
    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`,
      {
        message: 'Initial upload of questions.txt',
        content: encodedContent,
      },
      {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    );
    res.send({ status: 'Uploaded to GitHub' });
  }

  fs.unlinkSync(file.path);
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
