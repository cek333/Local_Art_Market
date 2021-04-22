import React, { useState } from 'react';
import constants from '../utils/constants_client';

function Search(props) {
  const [ searchParams, setSearchParams ] = useState({ searchTerm: '', searchSort: '', category: '', priceLevel: '' }); 
  const { user: propsUser, itemsByCategory: propsItemsByCategory, 
    itemsByPrice: propsItemsByPrice, updateItemList: propsUpdateItemList } = props;

  function handleChange(evt) {
    const { name, value } = evt.target;
    setSearchParams({ ...searchParams, [name]: value });
  }

  function clearSearchParams() {
    setSearchParams({ searchTerm: '', searchSort: '', category: '', priceLevel: '' });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const { searchTerm, searchSort, category, priceLevel } = searchParams;
    // Note, searchSort only set if user==='customer' and location is defined
    const location = searchSort === 'Distance' ? propsUser.location : '';
    propsUpdateItemList(searchTerm, category, priceLevel, location);
  }

  let searchSort;
  if (propsUser.type === 'customer' && propsUser.location) {
    searchSort =
      <>
        <label htmlFor='searchSort'>Sort By:</label>
        <select name='searchSort' id='searchSort' onChange={handleChange}>
          <option value={searchSort}>Relevance</option>
          <option value={searchSort}>Distance</option>
        </select>
      </>
  } else {
    searchSort = <></>;
  }

  return (
    <form className='box search' onSubmit={handleSubmit}>
      <input type='text' id='searchTerm' name='searchTerm' placeholder='Search'
          onChange={handleChange} />
      {searchSort}
      <fieldset>
        <legend>Categories</legend>
        {propsItemsByCategory.map(category => {
          const { _id: categoryName, count } = category;
          return (
            <React.Fragment key={categoryName}>
              <input type='radio' id={categoryName} name='category' value={categoryName}
                onChange={handleChange} checked={categoryName===searchParams.category} />
              <label htmlFor={categoryName}> {categoryName}&nbsp;({count})</label><br />
            </React.Fragment>
          );
        })}
      </fieldset>
      <fieldset>
        <legend>Price Ranges</legend>
        {propsItemsByPrice.map(price => {
          const { _id: priceLevel, count } = price;
          const priceLabel = constants.PRICE_LABEL_MAP[priceLevel];
          const priceId = `price${priceLevel}`; // avoid using simple numbers as html ids
          return (
            <React.Fragment key={priceId}>
              <input type='radio' id={priceId} name='priceLevel' value={priceLevel}
                onChange={handleChange} checked={priceLevel.toString()===searchParams.priceLevel} />
              <label htmlFor={priceId}> {priceLabel}&nbsp;({count})</label><br />
            </React.Fragment>
          );
        })}
      </fieldset>
      <div className='sameRow'>
        <button type='submit' value='submit'>Apply</button>
        <button type='reset' value='reset' onClick={()=>clearSearchParams()}>Reset</button>
      </div>
    </form>
  );
}

export default Search;