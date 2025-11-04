import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  label?: string;
}

const TextSeparator = ({ label, ...restProps }: Props) => {
  return (
    <>
      <div className="grid min-h-px place-items-center overflow-clip">
        <p
          {...restProps}
          className={cn(
            "after:border-border before:border-border text-muted-foreground relative before:absolute before:top-1/2 before:-left-[1000px] before:z-0 before:w-[1000px] before:border-t after:absolute after:top-1/2 after:-right-[1000px] after:z-0 after:w-[1000px] after:border-t",
            label ? "px-2" : "",
            restProps.className,
          )}
        >
          {label}
        </p>
      </div>
    </>
  );
};

export default TextSeparator;
