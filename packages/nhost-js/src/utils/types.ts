import type { AxiosResponse } from 'axios'

import { NhostAuthConstructorParams } from '@nhost/hasura-auth-js'

export type { NhostAuthConstructorParams }

type BackendUrl = {
  /**
   * Nhost backend URL
   * Will be deprecated in favor of `subdomain` and `region`
   */
  backendUrl: string
}

type Subdomain = {
  /**
   * App subdomain (e.g, ieingiwnginwnfnegqwvdqwdwq)
   */
  subdomain: string

  /**
   * App region (e.g., eu-central-1)
   */
  region: string
}

type Localhost = {
  /**
   * Use "localhost" in development
   * App region not required
   */
  subdomain: 'localhost'
}

export type BackendOrSubdomain = BackendUrl | Subdomain | Localhost

export type NhostClientConstructorParams = BackendOrSubdomain &
  Omit<NhostAuthConstructorParams, 'url'>

export type GraphqlRequestResponse<T = unknown> =
  | {
      data: null
      error: Error | object | object[]
    }
  | {
      data: T
      error: null
    }

export type FunctionCallResponse<T = unknown> =
  | {
      res: AxiosResponse<T>
      error: null
    }
  | {
      res: null
      error: Error
    }

export interface GraphqlResponse<T = object> {
  errors?: object[]
  data?: T
}
