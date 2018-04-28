import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TagLabel from "../src/elements/TagLabel";
import AppProviders from "../src/app/AppProviders";

storiesOf("Tag Label", module).add("default", () => (
  <AppProviders>
    <TagLabel>Tag Content Text</TagLabel>
  </AppProviders>
));
