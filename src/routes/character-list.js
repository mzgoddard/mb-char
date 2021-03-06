import {h} from 'preact';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {DocumentTitle} from 'react-document-title';
import {compose} from 'ramda';

import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Icon from 'semantic-ui-react/dist/es/elements/Icon';
import Header from 'semantic-ui-react/dist/es/elements/Header';
import Segment from 'semantic-ui-react/dist/es/elements/Segment';
import Checkbox from 'semantic-ui-react/dist/es/modules/Checkbox';
import Container from 'semantic-ui-react/dist/es/elements/Container';
import Form from 'semantic-ui-react/dist/es/collections/Form';
import Menu from 'semantic-ui-react/dist/es/collections/Menu';
import Grid from 'semantic-ui-react/dist/es/collections/Grid';

import {newCharacter, removeCharacter} from '../actions';

import {ConnectionStatus} from './character';

import styles from './character-list.css';

const _CharacterList = ({characters, newCharacter, addCharacter, removeCharacter}) => (
  <DocumentTitle title="Mistborn RPG">
    <Container as="div" text>
    <Button content="Toggle Delete Buttons" onClick={ev => (
      ev.currentTarget.parentElement.classList.toggle('edit')
    )} />
    <Menu vertical fluid>
      {
        characters
        .filter(c => c.id.owner)
        .map(c => (<Menu.Item
          as={Link}
          to={`/character/${c.id.code}`}
          style={{position: 'relative'}}>
          <span><Icon name="vcard" /></span>
          {c.overview.name}
          <ConnectionStatus id={c.id.code} className={styles.undelete} />
          <Button className={styles.delete} icon="delete" content="Delete" _characterId={c.id.code}
            style={{position: 'absolute', right: 0, top: '3px', bottom: '2px'}}
            onClick={removeCharacter}/>
        </Menu.Item>))
      }
      <Menu.Item fitted>
        <Input
          placeholder="Name ..."
          action={{icon: 'add', content: 'New', onClick: newCharacter}}
          onKeyUp={ev => ev.which === 13 && newCharacter(ev)} />
      </Menu.Item>
    </Menu>
    <Header>Remote</Header>
    <Menu vertical fluid>
      {
        characters
        .filter(c => !c.id.owner)
        .map(c => (<Menu.Item
          as={Link}
          to={`/character/${c.id.code}`}
          style={{position: 'relative'}}>
          <span><Icon name="vcard" /></span>
          {c.overview.name || ' '}
          <ConnectionStatus id={c.id.code} className={styles.undelete} />
          <Button className={styles.delete} icon="delete" content="Delete" _characterId={c.id.code}
            style={{position: 'absolute', right: 0, top: '3px', bottom: '2px'}}
            onClick={removeCharacter}/>
        </Menu.Item>))
      }
      <Menu.Item fitted>
        <Input
          placeholder="Remote code ..."
          action={{icon: 'add', content: 'Add', onClick: addCharacter}}
          onKeyUp={ev => ev.which === 13 && addCharacter(ev)} />
      </Menu.Item>
    </Menu>
    </Container>
  </DocumentTitle>
);

const siblingInput = node => (
  node.parentElement.getElementsByTagName('input')[0]
);

const getValueAndClear = ev => {
  const value = siblingInput(ev.currentTarget).value;
  siblingInput(ev.currentTarget).value = '';
  return value;
};

const getValueAndPreventDefault = ev => {
  ev.preventDefault();
  return ev.currentTarget.attributes._characterId.value;
};

export default connect(
  state => ({
    characters: state.characterSet,
  }),
  dispatch => ({
    newCharacter: compose(
      dispatch,
      name => newCharacter({name}),
      getValueAndClear
    ),
    addCharacter: compose(
      dispatch,
      id => newCharacter({id}),
      getValueAndClear
    ),
    removeCharacter: compose(
      dispatch,
      id => removeCharacter({id}),
      getValueAndPreventDefault
    ),
  })
)(_CharacterList);
