function Radio(props) {
  const { id: propsId, selected: propsSelected } = props;
  const attributes = {...props};
  delete attributes.selected;
  let tag;
  if (propsId === propsSelected) {
    tag = <input type='radio' {...attributes} checked />
  } else {
    tag = <input type='radio' {...attributes} />
  }
  return tag;
}

export default Radio;