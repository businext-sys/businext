import AgendaScreen from "@/screens/AgendaScreen";
import ChatScreen from "@/screens/ChatScreen";
import { assistantChatEnabled } from "@/lib/featureFlags";

export default assistantChatEnabled ? ChatScreen : AgendaScreen;
