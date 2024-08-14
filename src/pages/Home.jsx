/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import { Button, Header } from "semantic-ui-react";

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    await oktaAuth.signInWithRedirect({
      scopes: ["openid", "email", "profile"],
      acrValues: "urn:okta:loa:2fa:any",
    });
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Header as="h1">ADI CLINIC CONNECT - High Assurance</Header>

        {authState.isAuthenticated && !userInfo && (
          <div>Loading user information...</div>
        )}

        {authState.isAuthenticated && userInfo && (
          <div>
            <p>
              Welcome back,&nbsp;
              {userInfo.name}!
            </p>
            <p>
              You have successfully authenticated against your Okta org, and
              have been redirected back to this application.
            </p>
            <p>
              You now have an ID token and access token in local storage. Visit
              the <a href="/profile">My Profile</a> page to take a look inside
              the ID token.
            </p>
          </div>
        )}

        {!authState.isAuthenticated && (
          <div>
            <p>
              <span>This application is a High Assurance Application</span>
            </p>
            <p>
              When you click the login button below, you will be redirected to
              the login page on your Okta org.
            </p>
            <strong>Authentication Behavior</strong>
            <table>
              <thead>
                <th>Context</th>
                <th>Authentication Behavior</th>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Login - No prior Okta session exists</strong>
                  </td>
                  <td>Login + MFA</td>
                </tr>
                <tr>
                  <td>
                    <strong>Medium to High</strong>
                  </td>
                  <td>Just MFA (once per Okta session)</td>
                </tr>
                <tr>
                  <td>
                    <strong>High to High</strong>
                  </td>
                  <td>SSO</td>
                </tr>
              </tbody>
            </table>

            <br />
            <br />
            <Button id="login-button" primary onClick={login}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
