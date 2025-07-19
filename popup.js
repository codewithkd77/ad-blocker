document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('question').value;
  const answerDiv = document.getElementById('answer');
  
  if (!question.trim()) {
    answerDiv.textContent = "Our Ad Blocker extension does not collect, store, or share any personal information. All processing happens locally in your browser to block ads and enhance your browsing experience. We do not track your activity or send data to any servers.";
    return;
  }
  
  answerDiv.textContent = "Thinking...";
  
  const apiKey = "Your api key"; // <-- Replace with your Gemini API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Add instruction for concise answer
  const prompt = `Reply ONLY with the necessary answer, as concisely as possible, with no extra details.\nQuestion: ${question}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (answer) {
      answerDiv.textContent = answer;
    } else {
      answerDiv.textContent = "Ad Blocker Beta V1.0";
    }
  } catch (error) {
    console.error('Error:', error);
    answerDiv.textContent = "Error: " + error.message;
  }
});

// Allow Enter key to submit
document.getElementById('question').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('askBtn').click();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const copyBtn = document.getElementById('copyAnswer');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const answerDiv = document.getElementById('answer');
      const answerText = answerDiv.innerText || answerDiv.textContent;
      if (!answerText.trim()) {
        alert('No answer to copy!');
        return;
      }
      // Try Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(answerText).then(function() {
          showCopied();
        }).catch(function(err) {
          console.error('Clipboard API failed:', err);
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = answerText;
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            showCopied();
          } else {
            alert('Copy failed. Please copy manually.');
          }
        } catch (err) {
          alert('Copy failed: ' + err);
        }
      }
      function showCopied() {
        const icon = document.getElementById('copyAnswer');
        const old = icon.innerHTML;
        icon.innerHTML = '✅';
        setTimeout(() => { icon.innerHTML = old; }, 1000);
      }
    });
  }
});
