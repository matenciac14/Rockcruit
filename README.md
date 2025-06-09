# **Rockcruit: AI-Assisted Research**

## **Description**
Rockcruit is an application developed in Next.js that uses Vercel's AI SDK and the Exa API to perform AI-assisted research. Users can initiate research on specific topics, categorize results, and expand content based on the insights obtained.

---

## **Features**
### **Main functionalities:**
1. **AI-Assisted Research:**
   - Start research on predefined or custom topics.
   - Get results categorized into:
     - **Worth Expanding.**
     - **Not Worth Expanding.**

2. **Content Generation:**
   - Generate articles based on research results.
   - Reinterpret content in styles such as journalistic, academic, conversational, or technical.

3. **Dynamic Title Generation:**
   - Generate multiple titles for articles based on the initial content.
   - Allow users to select the number of titles to generate.

4. **Content Editor:**
   - Expand and edit generated content.
   - Integrate selected titles into the editor.

---

## **Technologies Used**
- **Frontend:** Next.js with TypeScript.
- **Styling:** Tailwind CSS and Shadcn for reusable components.
- **Backend:** Next.js Server Actions and API Routes.
- **Integrations:**
  - **Vercel AI SDK:** For content generation and reinterpretation.
  - **Exa API:** For search and result categorization.
- **Global State:** Data management with localStorage and route revalidation.

---

## **Requirements**
### **Main Dependencies:**
- Node.js >= 16
- npm >= 8

### **API Keys:**
- **Exa API Key:** To perform searches using the Exa API.
- **OpenAI API Key:** For content generation and reinterpretation.

---

## **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rockcruit.git
   cd rockcruit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root of the project and add the API keys:
   ```env
   EXA_API_KEY=your-exa-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## **Usage**
### **1. Main Page:**
- Access the main page to start research.
- Select a predefined topic or enter a custom topic.

### **2. Categorized Results:**
- View results categorized into "Worth Expanding" and "Not Worth Expanding."
- Click "Expand Content" to generate an article based on a result.

### **3. Content Editor:**
- Generate dynamic titles for the article.
- Reinterpret content in different styles.

---

## **Project Structure**
```
rockcruit/
├── app/
│   ├── components/
│   │   ├── categorized-list.tsx
│   │   ├── content-editor.tsx
│   │   ├── research-form.tsx
│   ├── lib/
│   │   ├── actions/
│   │   │   ├── generate-article.ts
│   │   │   ├── generate-titles.ts
│   │   │   ├── research.ts
│   ├── services/
│   │   ├── categorization.ts
│   │   ├── exa-service.ts
│   │   ├── openai-service.ts
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts
│   │   ├── reinterpret/
│   │   │   └── route.ts
│   │   ├── research/
│   │   │   └── route.ts
│   │   ├── titles/
│   │   │   └── routes.ts
│   ├── research/
│   │   └── page.tsx
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
├── .env.local
├── .gitignore
├── README.md
```

---

## **API Endpoints**
### **1. `/api/research`**
- **Method:** `POST`
- **Description:** Performs a search using the Exa API and categorizes the results.
- **Parameters:**
  - `topic`: Research topic.
- **Response:**
  ```json
  {
    "success": true,
    "results": {
      "worthExpanding": [...],
      "notWorthExpanding": [...]
    }
  }
  ```

### **2. `/api/generate`**
- **Method:** `POST`
- **Description:** Generates an article based on a context and an optional URL.
- **Parameters:**
  - `context`: Article context.
  - `sourceUrl`: Optional URL for additional content.
- **Response:** Text streaming.

### **3. `/api/reinterpret`**
- **Method:** `POST`
- **Description:** Reinterprets content in a specific style.
- **Parameters:**
  - `content`: Content to reinterpret.
  - `style`: Reinterpretation style.
- **Response:** Text streaming.

### **4. `/api/titles`**
- **Method:** `POST`
- **Description:** Generates dynamic titles for an article.
- **Parameters:**
  - `content`: Article content.
  - `count`: Number of titles to generate.
- **Response:**
  ```json
  {
    "success": true,
    "titles": ["Title 1", "Title 2", ...]
  }
  ```

---

## **Common Issues**
### **1. Hydration Error**
- **Cause:** Differences between server-rendered and client-rendered HTML.
- **Solution:** Use `suppressHydrationWarning` for dynamic elements.

### **2. API Errors**
- **Cause:** Incorrect API keys or invalid parameters.
- **Solution:** Verify API keys and parameters.

### **3. LocalStorage Issues**
- **Cause:** Non-persistent data or unexpected format.
- **Solution:** Use a backend to persist data instead of `localStorage`.

---

## **Contribution**
1. Fork the repository.
2. Create a branch for your feature:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and create a pull request.

---

## **License**
This project is licensed under the MIT License.

---