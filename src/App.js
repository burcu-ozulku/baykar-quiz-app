import React, { useState, useEffect } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [choicesEnabled, setChoicesEnabled] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.slice(0, 10)); // ilk 10 soru
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          nextQuestion();
        }
        return prevTime - 1;
      });
    }, 1000);

    const enableChoicesTimer = setTimeout(() => {
      setChoicesEnabled(true);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(enableChoicesTimer);
    };
  }, [currentQuestionIndex]);

  const nextQuestion = () => {
    setChoicesEnabled(false);
    setTimeLeft(30);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleAnswerSelection = (choice) => {
    if (!choicesEnabled) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = choice;
    setSelectedAnswers(newAnswers);
    nextQuestion();
  };

  const renderChoices = () => {
    if (!questions.length) return null;
    const words = questions[currentQuestionIndex].body.split(" ");
    const choices = words.slice(0, 4);

    return choices.map((choice, index) => (
      <label
        key={index}
        className={`w-full flex items-center justify-center p-4 mt-3 text-lg font-medium border rounded cursor-pointer transition-colors
          ${
            selectedAnswers[currentQuestionIndex] === choice
              ? "bg-gray-700 text-white"
              : choicesEnabled
              ? "bg-gradient-to-r from-purple-500 via-purple-700  to-purple-900 text-white hover:bg-[#5447c4]"
              : "bg-[#5447c4] text-gray-300 opacity-50 cursor-not-allowed"
          }`}
      >
        <input
          type="radio"
          name="answer"
          value={choice}
          onClick={() => handleAnswerSelection(choice)}
          disabled={!choicesEnabled}
          className="mr-2 hidden"
        />
        {choice}
      </label>
    ));
  };

  return (
    <div className="bg-[#1b1947] min-h-screen flex flex-col items-center pt-8 gap-5 text-white">
      <div className="w-full min-w-[1024px] max-w-[1024px] items-center flex flex-col gap-10">
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-white md:text-4xl lg:text-5xl">
          Quiz App -{" "}
          <mark className="px-2 text-[#14214c] bg-gray-100 rounded dark:bg-blue-500">
            BAYKAR
          </mark>{" "}
        </h1>
        {showResults ? (
          <div className="w-full max-w-md px-8 pb-12 py-6 bg-white rounded-2xl shadow-md text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Sonuçlar</h2>
            <table className="min-w-full border-2 bg-white">
              <thead>
                <tr>
                  <th className="w-2/3 py-6 border-b-2">Soru</th>
                  <th className="w-1/3 py-6 border-b-2">Cevabınız</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="text-left">
                    <td className="py-2 px-6 border-b font-light">
                      {question.title}
                    </td>
                    <td className="py-2 px-6 border-b font-semibold">
                      {selectedAnswers[index] || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-[#251d52] rounded shadow-md text-white">
            <h2 className="text-sm font-bold mb-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <div className="text-lg font-normal mb-6">
              Time: <span className="text-white">{timeLeft} seconds</span>
            </div>
            <p className="text-5xl font-semibold mb-4 text-center">
              {questions[currentQuestionIndex]?.title}
            </p>
            <div className="choices flex flex-col items-center">
              {renderChoices()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
