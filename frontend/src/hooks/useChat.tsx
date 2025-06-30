import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Message {
    animation: string;
    facialExpression: string;
    lipsync: {
        mouthCues: Array<{
            start: number;
            end: number;
            value: string;
        }>;
    };
    audio: string;
}

interface ChatContextType {
    chat: (message: string) => Promise<void>;
    message: Message | null;
    onMessagePlayed: () => void;
    loading: boolean;
    cameraState: "zoomed" | "default" | "zoomeout";
    setCameraState: (state: "zoomed" | "default" | "zoomeout") => void;
}

interface ChatProviderProps {
    children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(false);
    const [cameraState, setCameraState] = useState<
        "zoomed" | "default" | "zoomeout"
    >("default");

    const chat = async (message: string) => {
        setLoading(true);
        try {
            const data = await fetch(`${backendUrl}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });
            const resp = await data.json();
            const newMessages = resp.messages as Message[];
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } catch (error) {
            console.error("Error in chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const onMessagePlayed = () => {
        setMessages((messages) => messages.slice(1));
    };

    useEffect(() => {
        if (messages.length > 0) {
            setMessage(messages[0]);
        } else {
            setMessage(null);
        }
    }, [messages]);

    return (
        <ChatContext.Provider
            value={{
                chat,
                message,
                onMessagePlayed,
                loading,
                cameraState,
                setCameraState,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
