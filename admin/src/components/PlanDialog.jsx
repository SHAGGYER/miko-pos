import React, {useState} from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import {Form} from "./UI/Form";
import PrimaryButton from "./UI/PrimaryButton";
import {UI} from "./UI/UI";
import {useDialog} from "react-st-modal";
import cogoToast from "cogo-toast";
import {WithContext as ReactTags} from 'react-tag-input';
import {Alert} from "./UI/Alert";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function PlanDialog({plan}) {
  const dialog = useDialog();
  const [title, setTitle] = useState(plan?.title || "");
  const [amountShops, setAmountShops] = useState(plan?.amountShops || "");
  const [stripeId, setStripeId] = useState(plan?.stripeId || "");
  const [price, setPrice] = useState(plan?.price || "");
  const [disabled, setDisabled] = useState(plan?.disabled ? "yes" : "no");
  const [tags, setTags] = useState(plan?.tags ? plan.tags.map(tag => {
    return {
      id: tag,
      text: tag
    }
  }) : []);
  const [error, setError] = useState({})

  const handleTagDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleTagAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleTagDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({})
    const _error = {}

    if (!title) _error.title = "Titel er påkrævet"
    if (!stripeId) _error.stripeId = "Stripe ID er påkrævet"
    if (!price) _error.price = "Pris er påkrævet"
    if (!tags.length) _error.tags = "Tags er påkrævet"
    if (!amountShops) _error.amountShops = "Antal af butikker er påkrævet"

    if (Object.keys(_error).length) {
      setError(_error)
      return
    }


    try {
      if (!plan) {
        const body = {
          title,
          stripeId,
          price,
          amountShops,
          disabled: disabled === "yes",
          tags: tags.map(tag => tag.text)
        };

        await HttpClient().post("/api/admin/plan", body);
        cogoToast.success("Plan oprettet");
        dialog.close(true);
      } else {
        const body = {
          title,
          stripeId,
          price,
          amountShops,
          disabled: disabled === "yes",
          tags: tags.map(tag => tag.text)
        };

        await HttpClient().put(`/api/admin/plan/${plan._id}`, body);
        cogoToast.success("Plan opdateret");
        dialog.close(true);
      }
    } catch (error) {
      if (error.response) {
        cogoToast.error(error.response.data.error);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Opret Webhotel</h2>

      <form onSubmit={onSubmit}>
        <Form.TextField
          label="Titel"
          value={title}
          error={error.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <UI.Spacer bottom={1}/>

        <Form.TextField
          label="Antal Butikker"
          value={amountShops}
          error={error.amountShops}
          onChange={(e) => setAmountShops(e.target.value)}
        />
        <UI.Spacer bottom={1}/>

        <Form.TextField
          label="Stripe ID"
          value={stripeId}
          error={error.stripeId}
          onChange={(e) => setStripeId(e.target.value)}
        />
        <UI.Spacer bottom={1}/>

        <Form.TextField
          label="Price"
          value={price}
          error={error.price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <UI.Spacer bottom={1}/>

        <Form.TextField inputEl={
          <ReactTags
            tags={tags}
            handleDelete={handleTagDelete}
            handleAddition={handleTagAddition}
            handleDrag={handleTagDrag}
            inputFieldPosition="bottom"
            autocomplete
            autofocus={false}
            delimiters={delimiters}
          />}
                        noMarginLabel={true}
                        label="Tags"
                        error={error.tags}
        />

        <UI.Spacer bottom={1}/>

        <Form.Select
          label="Disabled"
          value={disabled}
          onChange={(e) => setDisabled(e.target.value)}
        >
          <option value="no">Nej</option>
          <option value="yes">Ja</option>
        </Form.Select>
        <UI.Spacer bottom={1}/>

        <PrimaryButton type="submit">{!plan ? "Opret" : "Gem"}</PrimaryButton>
      </form>
    </Wrapper>
  );
}
