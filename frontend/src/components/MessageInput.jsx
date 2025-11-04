// frontend/src/components/MessageInput.jsx
import { useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export default function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const { sendMessage } = useChatStore();
  const { authUser } = useAuthStore();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    sendMessage({ text: text.trim() || null, image: imagePreview || null });
    setText("");
    removeImage();
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="mb-3 max-w-3xl mx-auto flex items-center gap-3">
          <img
            src={imagePreview}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
          <button onClick={removeImage} className="btn">
            Remove
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            playRandomKeyStrokeSound();
          }}
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded p-2 bg-slate-800/60"
        />

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
          className="hidden"
        />
        <button type="button" onClick={() => fileRef.current?.click()}>
          <ImageIcon />
        </button>
        <button type="submit">
          <SendIcon />
        </button>
      </form>
    </div>
  );
}
