import { useUnit } from "effector-react";
import {
  $likedIds,
  likeClicked,
  unlikeClicked,
} from "../../entities/likes/model";

export function LikeButton({
  productId,
  size = 30,
}: {
  productId: string;
  size?: number;
}) {
  const likedSet = useUnit($likedIds);
  const liked = likedSet.has(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) unlikeClicked(productId);
    else likeClicked(productId);
  };

  return (
    <button
      className="like-btn"
      aria-pressed={liked}
      title={liked ? "Remove from liked" : "Add to liked"}
      onClick={onClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.875 0-3.52 1.065-4.312 2.625-.792-1.56-2.437-2.625-4.312-2.625C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
