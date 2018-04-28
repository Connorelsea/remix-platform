import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TagLabel from "./TagLabel";

storiesOf("Tag Label", module).add("default", () => (
  <TagLabel>Tag Content Text</TagLabel>
));
