"use client";

type Props = {
  file: File | null;
  previewUrl: string | null;
  onChoose: (f: File) => void;
  onRemove: () => void;
};

const MAX_MB = 10;
const ACCEPT = ["image/jpeg", "image/png"];

export default function Dropzone({ file, previewUrl, onChoose, onRemove }: Props) {
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndPass(f);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndPass(f);
  };

  const validateAndPass = (f: File) => {
    if (!ACCEPT.includes(f.type)) {
      alert("Only JPG/PNG are supported.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      alert(`Max file size is ${MAX_MB} MB.`);
      return;
    }
    onChoose(f);
  };

  return (
    <div>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`
          block rounded-2xl border-2 border-dashed
          ${file ? "border-green-300 bg-green-50/40" : "border-slate-300 hover:border-indigo-400"}
          p-6 cursor-pointer transition
        `}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected"
            className="w-full aspect-video object-contain rounded-xl bg-slate-50"
          />
        ) : (
          <div className="text-center text-slate-600 py-12">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="font-semibold">Drag & drop your image here</p>
            <p className="text-sm">or click to choose a file (JPG/PNG, up to {MAX_MB} MB)</p>
          </div>
        )}
        <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onInput} />
      </label>

      {file && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="truncate">{file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <button onClick={onRemove} className="px-3 py-1 rounded-md border hover:bg-slate-100">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
