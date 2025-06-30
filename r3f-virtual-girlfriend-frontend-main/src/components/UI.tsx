import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({
    hidden,
    ...props
}: {
    hidden?: boolean;
    [key: string]: any;
}) => {
    const input = useRef<HTMLInputElement>(null);
    const { chat, loading, setCameraState, message } = useChat();
    const [voiceListening, setVoiceListening] = useState(false);

    const sendMessage = () => {
        const text = input.current.value;
        if (!loading && !message && text.trim() !== "") {
            chat(text);
            input.current.value = "";
        }
    };

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setVoiceListening(true);
        };

        recognition.onend = () => {
            setVoiceListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.current.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setVoiceListening(false);
        };

        recognition.start();
    };

    const [mode, setMode] = useState<"text" | "voice">("voice");
    if (hidden) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none justify-between flex flex-col">
            <div className="flex justify-between gap-4 h-fit flex-shrink-0 items-center p-[2.25rem] pointer-events-auto">
                <button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-[1.5rem] text-[#C9C9C9]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
                <div className="flex gap-[1.5rem] items-center">
                    <div className="flex rounded-[0.25rem] border border-[#6C6C6C] overflow-clip divide-[#6C6C6C] divide-x items-stretch bg-[#242424]">
                        <button
                            className="p-[0.25rem] flex items-center flex-1"
                            onClick={() => {
                                setCameraState("zoomeout");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-[1.5rem] text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14"
                                />
                            </svg>
                        </button>
                        <button
                            className="p-[0.25rem] flex items-center flex-1"
                            onClick={() => {
                                setCameraState("default");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-[1.5rem] text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                />
                            </svg>
                        </button>
                        <button
                            className="p-[0.25rem] flex items-center flex-1"
                            onClick={() => {
                                setCameraState("zoomed");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-[1.5rem] text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        </button>
                    </div>

                    <button
                        className="py-[0.5rem] px-[0.75rem] bg-[#242424] rounded-full text-white border border-[#6C6C6C] font-semibold w-[10rem]"
                        onClick={() => {
                            setMode(mode === "text" ? "voice" : "text");
                        }}
                    >
                        {mode === "text" ? "Return to voice" : "Switch to text"}
                    </button>
                    <button className="rounded-full overflow-clip">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-[2.5rem] bg-[#303030] text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mb-[6.25rem] self-center pointer-events-auto">
                {mode === "text" ? (
                    <div className="flex min-w-[37.5rem] rounded-[4rem] bg-gradient-to-r from-[#D44264] to-[#6C2C8E] p-[3px]">
                        <div className="h-full w-full flex bg-[#1F1F1F] rounded-[4rem] items-center">
                            <input
                                className="flex-grow bg-transparent rounded-[4rem] rounded-r-none p-[1rem] focus:outline-none placeholder:text-gray-400 text-white"
                                placeholder="Type a message..."
                                ref={input}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                className="self-stretch aspect-square rounded-full bg-gradient-to-b from-[#DE4561] to-[#5B2996] m-[0.5rem] min-h-[2.5rem] flex-shrink-0 p-[0.75rem] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#DE4561] focus:ring-offset-2 ring-offset-[#1F1F1F]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    sendMessage();
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-[1.25rem] text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[1rem] items-center text-white">
                        <button
                            className="self-stretch aspect-square rounded-full bg-gradient-to-b from-[#DE4561] to-[#5B2996]  min-h-[2.5rem] flex-shrink-0 p-[0.75rem] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#FFF] focus:ring-offset-2 ring-offset-[#1F1F1F]"
                            onClick={(e) => {
                                e.preventDefault()
                                startListening()
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                className="h-[3rem] text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                                />
                            </svg>
                        </button>
                        <div>{voiceListening ? "Listening" : "Speak"}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// function aaa() {
//     return (
//         <>
//             {/* Header */}
//             <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
//                 <h1 className="font-black text-xl">AvatarGPT</h1>
//                 <p>TEXMIN</p>
//             </div>

//             {/* Top-right buttons */}
//             <div className="w-full flex flex-col items-end justify-center gap-4">
//                 <button
//                     onClick={() => setCameraZoomed(!cameraZoomed)}
//                     className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
//                 >
//                     {cameraZoomed ? (
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth={1.5}
//                             stroke="currentColor"
//                             className="w-6 h-6"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
//                             />
//                         </svg>
//                     ) : (
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth={1.5}
//                             stroke="currentColor"
//                             className="w-6 h-6"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
//                             />
//                         </svg>
//                     )}
//                 </button>
//             </div>

//             {/* Input section */}
//             <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
//                 <input
//                     className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
//                     placeholder="Type a message..."
//                     ref={input}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                             sendMessage();
//                         }
//                     }}
//                 />
//                 {/* Mic Button */}
//                 <button
//                     onClick={startListening}
//                     className={`${
//                         voiceListening
//                             ? "bg-blue-600 animate-pulse"
//                             : "bg-blue-500"
//                     } hover:bg-blue-600 text-white p-4 rounded-md`}
//                     title="Speak"
//                 >
//                     🎤
//                 </button>

//                 {/* Send Button */}
//                 <button
//                     disabled={loading || message}
//                     onClick={sendMessage}
//                     className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
//                         loading || message
//                             ? "cursor-not-allowed opacity-30"
//                             : ""
//                     }`}
//                 >
//                     Send
//                 </button>
//             </div>
//         </>
//     );
// }
