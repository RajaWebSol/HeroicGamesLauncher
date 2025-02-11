import React from 'react';

import {
  fireEvent,
  render
} from '@testing-library/react';

import { initElectronMocks } from 'src/test_helpers/mock/electron';
import { ipcRenderer } from 'electron';
import { resetTestTypes, test_context } from 'src/test_helpers/testTypes';
import ContextProvider from 'src/state/ContextProvider';
import UserSelector from './index';

function renderUserSelector() {
  return render(
    <ContextProvider.Provider value={test_context.get()}>
      <UserSelector />
    </ContextProvider.Provider>);
}

describe('UserSelector', () => {
  beforeEach(() => {
    resetTestTypes();
    initElectronMocks();
  })

  test('render', () => {
    renderUserSelector();
  })

  test('shows correct username', () => {
    test_context.set({user: 'test-user'})
    const { getByTestId} = renderUserSelector();
    const userName = getByTestId('userName');
    expect(userName).toHaveTextContent('test-user');
  })

  test('calls refresh library on click', () => {
    const onRefreshLibrary = jest.fn();
    test_context.set({refreshLibrary: onRefreshLibrary})
    const { getByTestId } = renderUserSelector();
    const divLibrary = getByTestId('refreshLibrary');
    expect(onRefreshLibrary).not.toBeCalled();
    fireEvent.click(divLibrary);
    expect(onRefreshLibrary).toBeCalledTimes(1);
  })

  test('calls handle kofi on click', () => {
    const { getByTestId } = renderUserSelector();
    const divKofi = getByTestId('handleKofi');
    expect(ipcRenderer.send).not.toBeCalled();
    fireEvent.click(divKofi);
    expect(ipcRenderer.send).toBeCalledWith('openSupportPage');
  })

  test('calls open discord link on click', () => {
    const { getByTestId } = renderUserSelector();
    const divDiscordLink = getByTestId('openDiscordLink');
    expect(ipcRenderer.send).not.toBeCalled();
    fireEvent.click(divDiscordLink);
    expect(ipcRenderer.send).toBeCalledWith('openDiscordLink');
  })

  test('calls open about window on click', () => {
    const { getByTestId } = renderUserSelector();
    const divAboutWindow = getByTestId('openAboutWindow');
    expect(ipcRenderer.send).not.toBeCalled();
    fireEvent.click(divAboutWindow);
    expect(ipcRenderer.send).toBeCalledWith('showAboutWindow');
  })

  test('calls handle logout on click and invoke ipc renderer if user confirm', () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    const { getByTestId } = renderUserSelector();
    const divLogout = getByTestId('handleLogout');
    expect(ipcRenderer.invoke).not.toBeCalled();
    fireEvent.click(divLogout);
    expect(ipcRenderer.invoke).toBeCalledTimes(1);
    expect(ipcRenderer.invoke).toBeCalledWith('logout');
  })

  test('calls handle logout on click and doesn not invoke ipc renderer if user does not confirm', () => {
    window.confirm = jest.fn().mockImplementation(() => false)

    const { getByTestId } = renderUserSelector();
    const divLogout = getByTestId('handleLogout');
    expect(ipcRenderer.invoke).not.toBeCalled();
    fireEvent.click(divLogout);
    expect(ipcRenderer.invoke).not.toBeCalled();
  })

  test('calls handle quit on click', () => {
    const { getByTestId } = renderUserSelector();
    const divQuit = getByTestId('handleQuit');
    expect(ipcRenderer.send).not.toBeCalled();
    fireEvent.click(divQuit);
    expect(ipcRenderer.send).toBeCalledWith('quit');
  })
})
