import { useState } from "react";

function AIInsights() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const suggestedQuestions = [
    "Which project needs more attention?",
    "Which project has the highest budget risk?",
    "Which tasks need immediate attention?",
    "Are there any projects at risk of delay?",
    "Give me an overall construction summary.",
    "What should the project manager focus on?",
    "Are there any workforce concerns?",
    "Are there any material concerns?",
  ];

  const getConstructionData = () => {
    const projects =
      JSON.parse(
        localStorage.getItem("constructionProjects")
      ) || [];

    const tasks =
      JSON.parse(
        localStorage.getItem("constructionTasks")
      ) || [];

    const workers =
      JSON.parse(
        localStorage.getItem("constructionWorkers")
      ) || [];

    const expenses =
      JSON.parse(
        localStorage.getItem("constructionExpenses")
      ) || [];

    const materials =
      JSON.parse(
        localStorage.getItem("constructionMaterials")
      ) || [];

    return {
      projects,
      tasks,
      workers,
      expenses,
      materials,
    };
  };

  const generateInsights = async (question) => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = getConstructionData();

      console.log("Sending construction data...");
      console.log(data);

      const response = await fetch(
        "http://localhost:5000/api/ai-insights",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...data,
            question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to generate AI insights."
        );
      }

      const responseData = await response.json();

      console.log(
        "Backend response:",
        responseData
      );

      if (!responseData.success) {
        throw new Error(
          responseData.message ||
            "Unable to generate insights."
        );
      }

      setResult(responseData.insight);
    } catch (error) {
      console.error(
        "AI request error:",
        error
      );

      setError(
        "Unable to connect to the BuildTrack AI backend. Please make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
          BuildTrack AI
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          AI Construction Insights
        </h1>

        <p className="text-slate-500 mt-2">
          Analyze your construction projects using
          intelligent project insights.
        </p>
      </div>


      {/* AI Assistant Card */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
            🤖
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              BuildTrack AI Assistant
            </h2>

            <p className="text-slate-500 mt-1">
              Ask questions about your projects,
              tasks, workers, expenses, and materials.
            </p>
          </div>

        </div>


        {/* Suggested Questions */}

        <div className="mt-8">

          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Suggested Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {suggestedQuestions.map(
              (question, index) => (
                <button
                  key={index}
                  onClick={() =>
                    generateInsights(question)
                  }
                  disabled={loading}
                  className="text-left border border-slate-200 rounded-xl p-4 hover:border-orange-400 hover:bg-orange-50 transition disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">

                    <span className="text-lg">
                      {index === 0 && "🎯"}
                      {index === 1 && "💰"}
                      {index === 2 && "📋"}
                      {index === 3 && "⚠️"}
                      {index === 4 && "📊"}
                      {index === 5 && "💡"}
                      {index === 6 && "👷"}
                      {index === 7 && "🧱"}
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {question}
                    </span>

                  </div>
                </button>
              )
            )}

          </div>

        </div>


        {/* Generate Button */}

        <div className="mt-6">

          <button
            onClick={() =>
              generateInsights(
                "Give me an overall construction summary."
              )
            }
            disabled={loading}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading
              ? "Analyzing Construction Data..."
              : "🤖 Generate AI Insights"}
          </button>

        </div>

      </div>


      {/* Loading */}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

          <div className="flex items-center gap-4">

            <div className="text-3xl animate-pulse">
              🤖
            </div>

            <div>
              <h3 className="font-bold text-blue-800">
                BuildTrack AI is analyzing...
              </h3>

              <p className="text-sm text-blue-700 mt-1">
                Reviewing projects, tasks,
                workers, expenses and materials.
              </p>
            </div>

          </div>

        </div>
      )}


      {/* Error */}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

          <div className="flex gap-4">

            <div className="text-2xl">
              ⚠️
            </div>

            <div>

              <h3 className="font-bold text-red-800">
                AI Connection Error
              </h3>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>

            </div>

          </div>

        </div>
      )}


      {/* AI Result */}

      {result && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Result Header */}

          <div className="bg-slate-900 text-white p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                🤖
              </div>

              <div>

                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  BuildTrack AI
                </p>

                <h2 className="text-xl font-bold">
                  {result.title}
                </h2>

              </div>

            </div>

          </div>


          {/* Summary */}

          <div className="p-6">

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

              <p className="text-sm font-semibold text-blue-800 mb-2">
                AI Analysis
              </p>

              <p className="text-sm text-blue-700 leading-6">
                {result.summary}
              </p>

            </div>


            {/* Recommendations */}

            {result.recommendations &&
              result.recommendations.length >
                0 && (
                <div className="mt-6">

                  <h3 className="text-lg font-bold text-slate-800">
                    Recommended Actions
                  </h3>

                  <div className="mt-4 space-y-3">

                    {result.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-4"
                        >

                          <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>

                          <p className="text-sm text-slate-700 leading-6">
                            {recommendation}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

          </div>

        </div>
      )}


      {/* Information */}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

        <div className="flex gap-3">

          <span className="text-xl">
            💡
          </span>

          <div>

            <h3 className="font-semibold text-slate-800">
              About BuildTrack AI
            </h3>

            <p className="text-sm text-slate-500 mt-1 leading-6">
              BuildTrack analyzes the construction
              information stored in your application
              and provides recommendations to help
              identify project risks, task priorities,
              budget concerns, workforce issues and
              material concerns.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;