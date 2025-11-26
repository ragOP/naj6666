import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import agent from "../src/assets/pic.png";
import tick from "../src/assets/tick2.png";
import deliver from "../src/assets/delivered.svg";
import { EllipsisVertical, Paperclip, Phone } from "lucide-react";
import RaghibFinal from "./RaghibFinal";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [finalMessage, setFinalMessage] = useState(false);
  const [switchNumber, setSwitchNumber] = useState(true);

  const messagesEndRef = useRef(null);

  const getFormattedTime = (timeString) => {
    return timeString.split(" ")[0].split(":").slice(0, 2).join(":");
  };

  // FIRST MESSAGE + FIRST QUESTION
  useEffect(() => {
    const initialMessages = [
      {
        text: "Hola Bienvenido a Settlement Allies! Responde el cuestionario a continuación para comunicarte con uno de nuestros Asesores Legales, y recibir toda la ayuda para tu Accidente!",
        sender: "bot",
        time: new Date().toTimeString(),
      },
      {
        text: "¿Hubo un Reporte Policial del Accidente?",
        sender: "bot",
        options: ["Sí", "No"],
        time: new Date().toTimeString(),
      },
    ];

    addMessagesWithDelay(initialMessages);
  }, []);

  // BOT DELAY SYSTEM
  const addMessagesWithDelay = (botResponses) => {
    let delay = 0;
    setIsTyping(true);

    botResponses.forEach((response, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...response,
            time: new Date().toTimeString(),
            lastInSequence: index === botResponses.length - 1,
          },
        ]);

        if (index === botResponses.length - 1) {
          setIsTyping(false);
          if (response.options) setCurrentOptions(response.options);
        }
      }, (delay += 1500));
    });
  };

  // BUTTON CLICK LOGIC (NO INPUTS ANYWHERE)
  const handleOptionClick = (option) => {
    setMessages((prev) => [
      ...prev,
      { text: option, sender: "user", time: new Date().toTimeString() },
    ]);

    setCurrentOptions([]);
    let botResponses = [];

    // FIRST QUESTION → NEXT QUESTION
    if (option === "Sí" || option === "No") {
      botResponses = [
        {
          text: "¿Fecha del Accidente?",
          sender: "bot",
          options: ["0 a 3 Meses", "3 a 6 Meses", "6 Meses a 1 Año", "1 Año o Más"],
        },
      ];
    }

    // SECOND QUESTION → LAST QUESTION
    else if (
      option === "0 a 3 Meses" ||
      option === "3 a 6 Meses" ||
      option === "6 Meses a 1 Año" ||
      option === "1 Año o Más"
    ) {
      botResponses = [
        {
          text: "¿Fuiste Culpable del Accidente?",
          sender: "bot",
          options: [
            "No fui Culpable del Accidente",
            "Sí fui Culpable",
            "Una Falla Mecánica Causó el Accidente",
            "Ninguna de las Anteriores",
          ],
        },
      ];
    }

    // LAST QUESTION → DIRECTLY SHOW FINAL RESPONSE
    else if (
      option === "No fui Culpable del Accidente" ||
      option === "Sí fui Culpable" ||
      option === "Una Falla Mecánica Causó el Accidente" ||
      option === "Ninguna de las Anteriores"
    ) {
      // NO MORE QUESTIONS → DIRECT FINAL PAGE
      setTimeout(() => setFinalMessage(true), 1500);
      return;
    }

    addMessagesWithDelay(botResponses);
  };

  // AUTO SCROLL
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, finalMessage, isTyping]);

  return (
    <div
      className="w-full h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
      }}
    >
      {/* HEADER */}
      <div className="bg-[#005e54] text-white p-4 flex items-center gap-2 shadow-md sticky top-0 z-10 h-16">
        <img src={agent} alt="Agent" className="w-10 h-10 rounded-full" />

        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-sm">Aliados del asentamiento</p>
              <img src={tick} className="w-4 h-4" style={{ marginLeft: "-6px" }} />
            </div>
            <p className="text-sm">online</p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            <Paperclip className="w-5 h-5" />
            <EllipsisVertical className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col pb-52">

        {/* ALL MESSAGES */}
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "bot" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} relative`}
          >
            {msg.sender === "bot" && msg.lastInSequence && (
              <img src={agent} className="w-8 h-8 rounded-full mr-2 absolute bottom-0" />
            )}

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.3 }}
              className={`pt-2 px-2 pb-0 rounded-lg text-base shadow-md ${
                msg.sender === "user"
                  ? "bg-[#dcf8c6] text-gray-800"
                  : "bg-white text-gray-800 ms-10"
              }`}
              style={{ minWidth: "70px", overflow: "hidden" }}
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {msg.text}
              </motion.span>

              <span className="flex flex-row-reverse gap-1 items-center">
                {msg.sender === "user" && <img src={deliver} className="h-4 w-4" />}
                <span className="text-[10px] text-gray-400">
                  {getFormattedTime(msg.time)}
                </span>
              </span>
            </motion.div>
          </motion.div>
        ))}

        {/* TYPING ANIMATION */}
        {isTyping && (
          <motion.div className="flex items-center gap-2">
            <img src={agent} className="w-8 h-8 rounded-full" />
            <div className="max-w-xs p-2 bg-white rounded-lg flex gap-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}

        {/* ONLY BUTTON OPTIONS (NO INPUTS ANYWHERE) */}
        {currentOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 items-center justify-start ms-10">
            {currentOptions.map((option, i) => (
              <button
                key={i}
                className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* FINAL SCREEN */}
        {finalMessage && (
          <RaghibFinal finalMessage={finalMessage} switchNumber={switchNumber} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
