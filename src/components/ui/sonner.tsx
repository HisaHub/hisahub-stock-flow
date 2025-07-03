
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700",
          description: "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white dark:group-[.toast]:bg-blue-500",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-gray-400",
          success: "group-[.toast]:bg-green-50 group-[.toast]:text-green-800 group-[.toast]:border-green-200 dark:group-[.toast]:bg-green-900/20 dark:group-[.toast]:text-green-400 dark:group-[.toast]:border-green-800",
          error: "group-[.toast]:bg-red-50 group-[.toast]:text-red-800 group-[.toast]:border-red-200 dark:group-[.toast]:bg-red-900/20 dark:group-[.toast]:text-red-400 dark:group-[.toast]:border-red-800",
          warning: "group-[.toast]:bg-yellow-50 group-[.toast]:text-yellow-800 group-[.toast]:border-yellow-200 dark:group-[.toast]:bg-yellow-900/20 dark:group-[.toast]:text-yellow-400 dark:group-[.toast]:border-yellow-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
