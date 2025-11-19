import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group-[.toaster]:bg-[#0A0A0A] group-[.toaster]:text-white group-[.toaster]:border-[#333333] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-white/80',
          actionButton: 'group-[.toast]:bg-[#004AAD] group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-white/10 group-[.toast]:text-white',
          error: 'group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-red-700',
          success: 'group-[.toaster]:bg-green-600 group-[.toaster]:text-white group-[.toaster]:border-green-700',
          warning: 'group-[.toaster]:bg-yellow-600 group-[.toaster]:text-white group-[.toaster]:border-yellow-700',
          info: 'group-[.toaster]:bg-blue-600 group-[.toaster]:text-white group-[.toaster]:border-blue-700',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
