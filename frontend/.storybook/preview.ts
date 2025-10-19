import type { Preview } from "@storybook/react-vite";
import "../src/components/Footer.css";
import "../src/components/Header.css";
import "../src/pages/Login.css";
import "../src/pages/Dashboard.css";
import "../src/pages/Account.css";
import "../src/pages/ProductCreate.css";
import "../src/pages/ProductDetail.css";
import "../src/pages/Registration.css";
import "../src/pages/Dashboard.css";
import "../src/App.css";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
