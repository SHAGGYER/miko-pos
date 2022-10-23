import React, {useContext, useState} from 'react';
import SettingsGroup from "../components/UI/SettingsGroup";
import {Form} from "../components/UI/Form";
import {UI} from "../components/UI/UI";
import PrimaryButton from "../components/UI/PrimaryButton";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import cogoToast from "cogo-toast";

function Settings(props) {
  const {appSettings} = useContext(AppContext)
  const [env, setEnv] = useState(appSettings?.appEnv || "development")

  const saveAppEnv = async (event) => {
    event.preventDefault()

    const body = {
      appEnv: env
    }

    await HttpClient().put("/api/admin/settings", body);
    cogoToast.success("Settings saved!")
  }

  return (
    <div style={{maxWidth: 900}}>
      <h1 style={{marginBottom: "2rem"}}>Indstillinger</h1>

      <SettingsGroup title="App Miljø">
        <form onSubmit={saveAppEnv}>
          <Form.Select label="App Miljø" value={env} onChange={e => setEnv(e.target.value)}>
            <option value="development">Development</option>
            <option value="alpha">Alpha</option>
            <option value="beta">Beta</option>
            <option value="production">Production</option>
          </Form.Select>
          <UI.Spacer bottom={1}/>
          <PrimaryButton type={"submit"}>Gem</PrimaryButton>
        </form>
      </SettingsGroup>
    </div>
  );
}

export default Settings;