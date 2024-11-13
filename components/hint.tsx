import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface HintProps {
  label?: string;
  customBg?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
};

const Hint = ({ children, label, customBg, content }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={customBg!}>
          <p>{label}</p>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;