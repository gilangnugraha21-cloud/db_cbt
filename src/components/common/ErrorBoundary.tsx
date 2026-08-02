import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught CBT Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetState = () => {
    try {
      localStorage.clear();
    } catch {
      // Ignore storage clear errors
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-rose-950/80 border border-rose-700/80 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Aplikasi Mengalami Kendala
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Terjadi kesalahan teknis yang tidak terduga pada tampilan. Sistem telah mengamankan data Anda agar tidak hilang.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left font-mono text-[11px] text-rose-300/90 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-2xs transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Cache & Data Lokal</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
