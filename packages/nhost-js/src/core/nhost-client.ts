import { HasuraAuthClient } from '@nhost/hasura-auth-js'
import { HasuraStorageClient } from '@nhost/hasura-storage-js'

import { NhostFunctionsClient } from '../clients/functions'
import { NhostGraphqlClient } from '../clients/graphql'
import { urlFromParams } from '../utils/helpers'
import { NhostClientConstructorParams } from '../utils/types'

export class NhostClient {
  auth: HasuraAuthClient
  storage: HasuraStorageClient
  functions: NhostFunctionsClient
  graphql: NhostGraphqlClient
  readonly devTools?: boolean

  /**
   * Nhost Client
   *
   * @example
   * const nhost = new NhostClient({ subdomain, region });
   *
   * @docs https://docs.nhost.io/reference/javascript
   */
  constructor({
    refreshIntervalTime,
    clientStorageGetter,
    clientStorageSetter,
    clientStorage,
    clientStorageType,
    autoRefreshToken,
    autoSignIn,
    devTools,
    start = true,
    ...urlParams
  }: NhostClientConstructorParams) {
    this.auth = new HasuraAuthClient({
      url: urlFromParams(urlParams, 'auth'),
      refreshIntervalTime,
      clientStorageGetter,
      clientStorageSetter,
      clientStorage,
      clientStorageType,
      autoRefreshToken,
      autoSignIn,
      start
    })

    this.storage = new HasuraStorageClient({
      url: urlFromParams(urlParams, 'storage')
    })

    this.functions = new NhostFunctionsClient({
      url: urlFromParams(urlParams, 'functions')
    })

    this.graphql = new NhostGraphqlClient({
      url: urlFromParams(urlParams, 'graphql')
    })

    // * Set current token if token is already accessable
    this.storage.setAccessToken(this.auth.getAccessToken())
    this.functions.setAccessToken(this.auth.getAccessToken())
    this.graphql.setAccessToken(this.auth.getAccessToken())

    this.auth.client?.onStart(() => {
      // * Set access token when signing out
      this.auth.onAuthStateChanged((_event, session) => {
        if (_event === 'SIGNED_OUT') {
          this.storage.setAccessToken(undefined)
          this.functions.setAccessToken(undefined)
          this.graphql.setAccessToken(undefined)
        }
      })

      // * Update access token for clients, including when signin in
      this.auth.onTokenChanged((session) => {
        this.storage.setAccessToken(session?.accessToken)
        this.functions.setAccessToken(session?.accessToken)
        this.graphql.setAccessToken(session?.accessToken)
      })
    })
    this.devTools = devTools
  }
}
