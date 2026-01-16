# LeetShare

A website for sharing and showcasing LeetCode problem solutions.

## 📁 Project Structure

```
leet-share/
├── admin.py                           # Admin CLI tools
├── requirements.txt                   # Python dependencies
├── config.js                          # Frontend configuration
├── firebase.js                        # Firebase configuration
├── index.html                         # Main HTML file
├── ui.js                              # UI logic and event handlers
├── utils.js                           # Utility functions
├── style.css                          # Main stylesheet
├── hljs.css                           # Code highlighting stylesheet
└── README.md                          # Project documentation
```

## 🛠️ Tech Stack

### Frontend

- **HTML/CSS/JavaScript** - Core web technologies
- **Firebase Firestore** - Real-time cloud database
- **Highlight.js** - Code syntax highlighting

### Backend

- **Python3** - Admin CLI tools
- **Firebase Admin SDK** - Database management and authentication

### Supported Languages

- C
- C++
- Rust

To add support for additional programming languages, modify `admin.py`:

```python
ext_to_lang = {
  ".cpp": "cpp",
  ".c": "c",
  ".rs": "rust",
  ".py": "python",  # Add new language
}
```

Also update `index.html` to load the corresponding highlight.js language file:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/python.min.js"></script>
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- Firebase project with Admin SDK credentials
- Node.js (optional, for local development server)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/revival0728/leet-share.git
   cd leet-share
   ```

2. **Set up Python virtual environment**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On macOS/Linux
   # or
   .venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Firebase**

   - Download your Firebase Admin SDK credentials JSON file
   - Set the environment variable:

   ```bash
   export CERT_JSON_PATH="path/to/leet-share-firebase-adminsdk-*.json"
   ```

   - Or create a `.env` file:

   ```
   CERT_JSON_PATH=path/to/leet-share-firebase-adminsdk-*.json
   ```

5. **Initialize the database**

   ```bash
   python admin.py init
   ```

6. **Start the web application**
   - Open `index.html` in a web browser
   - Or serve it with a local server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   # Using Node.js
   npx serve .
   ```

## 📖 Usage Guide

### Admin Commands

Use the `admin.py` CLI tool to manage the database:

```bash
python admin.py --help
```

## 🌐 Deployment

You can deploy this repository on [GitHub Pages](https://pages.github.com)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [GitHub Repository](https://github.com/revival0728/leet-share)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Highlight.js Documentation](https://highlightjs.org/)
