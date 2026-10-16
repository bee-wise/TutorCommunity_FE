import Image from "next/image";

const illustrations = {
  session: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_400/v1789967862/15.png",
  goal: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_240/v1790241794/Bee_Robot_2.png",
  feedback: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_240/v1789967863/16.png",
  empty: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_160/v1789966155/10.png",
} as const;

export function BeeWiseLearningArt({
  variant,
  className,
}: {
  variant: keyof typeof illustrations;
  className: string;
}) {
  return (
    <Image
      src={illustrations[variant]}
      alt=""
      aria-hidden="true"
      width={200}
      height={200}
      sizes={variant === "session" ? "(min-width: 640px) 160px, 96px" : "80px"}
      className={"pointer-events-none shrink-0 select-none object-contain " + className}
    />
  );
}