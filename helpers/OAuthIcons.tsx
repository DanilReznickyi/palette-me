"use client";

type Props = {
  onGoogle?: () => void;
  onFacebook?: () => void;
  onApple?: () => void;
};

const Btn: React.FC<React.PropsWithChildren<{ onClick?: () => void; title: string }>> = ({ onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex-1 flex items-center gap-3 border rounded-lg px-3 py-2 justify-center hover:bg-slate-50 cursor-pointer"
  >
    {children}
  </button>
);

export function ProviderButtonRow({ onGoogle, onFacebook, onApple }: Props) {
  return (
    <div className="flex gap-3 justify-center">
      <Btn onClick={onGoogle} title="Continue with Google">
        <span className="inline-flex w-6 h-6">
          {/* Google G */}
          <svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.04,32.328,28.922,35,24,35c-7.18,0-13-5.82-13-13 s5.82-13,13-13c3.313,0,6.315,1.234,8.598,3.252l5.657-5.657C34.676,3.053,29.562,1,24,1C11.85,1,2,10.85,2,23 s9.85,22,22,22c11.046,0,20-8.954,20-20C44,23.659,43.862,21.836,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.333,16.152,18.824,13,24,13c3.313,0,6.315,1.234,8.598,3.252 l5.657-5.657C34.676,3.053,29.562,1,24,1C15.317,1,7.813,6.011,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,45c5.342,0,10.198-2.049,13.86-5.383l-6.404-5.414C29.319,35.012,26.805,36,24,36 c-4.861,0-8.975-3.26-10.44-7.674l-6.59,5.08C9.441,40.556,16.147,45,24,45z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.355,3.935-5.162,7-11.303,7c-5.176,0-9.667-3.152-11.123-7.809 l-6.571,5.068C7.813,39.989,15.317,45,24,45c11.046,0,20-8.954,20-20C44,23.659,43.862,21.836,43.611,20.083z" />
          </svg>
        </span>
        <span className="text-sm">Continue with Google</span>
      </Btn>

      <Btn onClick={onFacebook} title="Continue with Facebook">
        <span className="inline-flex w-6 h-6">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="#1877F2" d="M24,12.073C24,5.405,18.627,0,12,0S0,5.405,0,12.073C0,18.1,4.388,23.093,10.125,24v-8.437H7.078V12.07h3.047 V9.412c0-3.007,1.792-4.668,4.533-4.668c1.312,0,2.686,0.235,2.686,0.235v2.953h-1.513c-1.491,0-1.954,0.925-1.954,1.875v2.262h3.328 l-0.532,3.493h-2.796V24C19.612,23.093,24,18.1,24,12.073z"/>
          </svg>
        </span>
        <span className="text-sm">Continue with Facebook</span>
      </Btn>

      <Btn onClick={onApple} title="Continue with Apple">
        <span className="inline-flex w-6 h-6">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.462 2.23-1.287 3.055-.903.93-2.17 1.357-3.27 1.233-.06-1.09.487-2.254 1.31-3.084.91-.884 2.3-1.498 3.247-1.204zM21.5 17.264c-.61 1.38-.894 1.98-1.669 3.195-1.084 1.683-2.613 3.778-4.528 3.796-1.065.01-1.81-.314-2.87-.314-1.064 0-1.775.322-2.885.322-1.95.02-3.567-2.02-4.65-3.698C2.17 18.8.87 15.5 1.796 12.86c.66-1.915 2.36-3.23 4.23-3.25 1.06-.02 2.06.36 2.806.36.745 0 1.96-.445 3.31-.38 1.125.05 2.157.46 2.94 1.173-1.782 1.07-1.49 3.87.3 4.853.52.29 1.236.51 1.93.39.16.43.235.86.237 1.348 0 .49-.07.99-.15 1.01z" fill="currentColor"/>
          </svg>
        </span>
        <span className="text-sm">Continue with Apple</span>
      </Btn>
    </div>
  );
}
