import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { fork, type Scope } from "effector";
import { Provider as EffectorProvider } from "effector-react";
import { $likedIds } from "../../entities/likes/model";
import { LikeButton } from "./LikeButton";

const withEffectorSeeds =
  (seeds: Array<[any, any]> = []): Decorator =>
  (Story) => {
    const scope: Scope = fork({ values: new Map(seeds) });
    return (
      <EffectorProvider value={scope}>
        <Story />
      </EffectorProvider>
    );
  };

const meta: Meta<typeof LikeButton> = {
  title: "Shared/LikeButton",
  component: LikeButton,
  args: { productId: "demo-1", size: 30 },
};
export default meta;

type Story = StoryObj<typeof LikeButton>;

export const Unliked: Story = {
  decorators: [withEffectorSeeds([[$likedIds, new Set<string>()]])],
};

export const Liked: Story = {
  args: { productId: "demo-2" },
  decorators: [withEffectorSeeds([[$likedIds, new Set<string>(["demo-2"])]])],
};
