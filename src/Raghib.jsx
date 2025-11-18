import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import agent from "../src/assets/pic.png";
import tick from "../src/assets/tick2.png";
import deliver from "../src/assets/delivered.svg"
import {
  EllipsisVertical,
  Paperclip,
  Phone,
} from "lucide-react";
import RaghibFinal from "./RaghibFinal";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputType, setInputType] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [finalMessage, setFinalMessage] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [switchNumber, setSwitchNumber] = useState(true);
  const [formData, setFormData] = useState({
    policeReport: "",
    accidentDate: "",
    fault: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const messagesEndRef = useRef(null);

  const getFormattedTime = (timeString) => {
    return timeString.split(" ")[0].split(":").slice(0, 2).join(":");
  };

  useEffect(() => {
    const initialMessages = [
      {
        text: "¿Hubo un Reporte Policial del Accidente?",
        sender: "bot",
        options: ["Sí", "No"],
        time: new Date().toTimeString(),
      },
    ];
    addMessagesWithDelay(initialMessages);
  }, []);

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
          if (response.input) setShowInput(true);
        }
      }, (delay += 1500));
    });
  };

  const handleOptionClick = (option) => {
    setMessages((prev) => [
      ...prev,
      { text: option, sender: "user", time: new Date().toTimeString() },
    ]);
    setShowInput(false);
    setCurrentOptions([]);
    let botResponses = [];

    if (option === "Sí" || option === "No") {
      setFormData((prev) => {
        const updated = { ...prev, policeReport: option };
        return updated;
      });
      botResponses = [
        {
          text: "¿Fecha del Accidente?",
          sender: "bot",
          options: ["0 a 3 Meses", "3 a 6 Meses", "6 Meses a 1 Año", "1 Año o Más"],
        },
      ];
    }
    else if (
      option === "0 a 3 Meses" ||
      option === "3 a 6 Meses" ||
      option === "6 Meses a 1 Año" ||
      option === "1 Año o Más"
    ) {
      setFormData((prev) => {
        const updated = { ...prev, accidentDate: option };
        return updated;
      });
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
    else if (
      option === "No fui Culpable del Accidente" ||
      option === "Sí fui Culpable" ||
      option === "Una Falla Mecánica Causó el Accidente" ||
      option === "Ninguna de las Anteriores"
    ) {
      setFormData((prev) => {
        const updated = { ...prev, fault: option };
        return updated;
      });
      botResponses = [
        {
          text: "¡Último Paso! ¿Cuál es tu nombre?",
          sender: "bot",
          input: true,
        },
      ];
      setInputType("name");
      setShowInput(true);
    }

    addMessagesWithDelay(botResponses);
  };

  const handleSendInput = () => {
    if (inputType === "name") {
      if (inputValue.trim() === "" || inputValue2.trim() === "") return;
      const updatedData = { ...formData, firstName: inputValue, lastName: inputValue2 };
      setFormData(updatedData);
      setMessages((prev) => [
        ...prev,
        { text: `${inputValue} ${inputValue2}`, sender: "user", time: new Date().toTimeString() },
      ]);
      setInputValue("");
      setInputValue2("");
      setShowInput(false);
      let botResponses = [
        {
          text: "¿Cuál es tu correo electrónico?",
          sender: "bot",
          input: true,
        },
      ];
      setInputType("email");
      setTimeout(() => setShowInput(true), 1500);
      addMessagesWithDelay(botResponses);
    } else if (inputType === "email") {
      if (inputValue.trim() === "") return;
      const updatedData = { ...formData, email: inputValue };
      setFormData(updatedData);
      setMessages((prev) => [
        ...prev,
        { text: inputValue, sender: "user", time: new Date().toTimeString() },
      ]);
      setInputValue("");
      setShowInput(false);
      let botResponses = [
        {
          text: "Ingresa tu número de teléfono",
          sender: "bot",
          input: true,
        },
      ];
      setInputType("phone");
      setTimeout(() => setShowInput(true), 1500);
      addMessagesWithDelay(botResponses);
    } else if (inputType === "phone") {
      if (inputValue.trim() === "") return;
      const updatedData = { ...formData, phone: inputValue };
      setFormData(updatedData);
      setMessages((prev) => [
        ...prev,
        { text: inputValue, sender: "user", time: new Date().toTimeString() },
      ]);
      setInputValue("");
      setShowInput(false);
      setTimeout(() => {
        setFinalMessage(true);
        console.log(">>>>>>>> COMPLETE FORM DATA:", updatedData);
      }, 2000);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if(finalMessage){
        container.scrollTo({
          top: container.scrollHeight - container.clientHeight - 100,
          behavior: "smooth",
        });
      }else{
        container.scrollTo({
          top: container.scrollHeight - container.clientHeight,
          behavior: "smooth",
        });
      }
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
      <div className="bg-[#005e54] text-white p-4 flex items-center gap-2 shadow-md sticky top-0 right-0 left-0 z-10 h-16">
        <img
          src={agent}
          alt="Psychic Master"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-sm">Live Benefit Helpline</p>
              <img src={tick} className="w-4 h-4"  style={{marginLeft:"-6px"}}/>
            </div>
            <p className="text-sm ">online</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-white" />
            <Paperclip className="w-5 h-5 text-white" />
            <EllipsisVertical className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col mt-[1%] pb-52">
        {messages.map((msg, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "bot" ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`flex relative ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && msg.lastInSequence && (
                <img
                  src={agent}
                  alt="Bot"
                  className="w-8 h-8 rounded-full mr-2 absolute bottom-0"
                />
              )}
              <motion.div
                initial={{ width: 0, height: 15 }}
                animate={{ width: "auto", height: "auto" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`pt-2 px-2 pb-0 rounded-lg text-base shadow-md ${
                  msg.sender === "user"
                    ? "bg-[#dcf8c6] text-gray-800"
                    : "bg-white text-gray-800 ms-10"
                }`}
                style={{ minWidth: "70px", overflow: "hidden" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {msg.text}
                </motion.span>

                <span className="flex flex-row-reverse gap-1 items-center">
                  {msg.sender === "user" && (
                    <img src={deliver} className="h-4 w-4" />
                  )}
                  <span className="text-[10px] text-gray-400">
                    {getFormattedTime(msg.time)}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          );
        })}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <img src={agent} alt="Bot" className="w-8 h-8 rounded-full" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs p-2 rounded-lg text-sm bg-white text-gray-800 flex items-center gap-1"
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </motion.div>
          </motion.div>
        )}
        {showInput && (
          <div className="mt-2 flex flex-col gap-2 items-end">
            {inputType === "name" ? (
              <>
                <div className="flex items-center gap-2 w-full justify-end">
                  <input
                    type="text"
                    className="border w-[60vw] p-4 rounded-2xl"
                    placeholder="Ingresa tu nombre"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendInput()}
                  />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  <input
                    type="text"
                    className="border w-[60vw] p-4 rounded-2xl"
                    placeholder="Ingresa tu apellido"
                    value={inputValue2}
                    onChange={(e) => setInputValue2(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendInput()}
                  />
                </div>
                <button
                  className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                  onClick={handleSendInput}
                >
                  SIGUIENTE
                </button>
              </>
            ) : inputType === "email" ? (
              <>
                <div className="flex items-center gap-2 w-full justify-end">
                  <input
                    type="email"
                    className="border w-[60vw] p-4 rounded-2xl"
                    placeholder="Ingresa tu correo electrónico"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendInput()}
                  />
                </div>
                <button
                  className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                  onClick={handleSendInput}
                >
                  SIGUIENTE
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 w-full justify-end">
                  <input
                    type="tel"
                    className="border w-[60vw] p-4 rounded-2xl"
                    placeholder="Ingresa tu número de teléfono"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendInput()}
                  />
                </div>
                <button
                  className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                  onClick={handleSendInput}
                >
                  Enviar
                </button>
              </>
            )}
          </div>
        )}
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
        {finalMessage && <RaghibFinal finalMessage={finalMessage} switchNumber={switchNumber}/>}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
