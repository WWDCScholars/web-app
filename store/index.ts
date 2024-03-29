import { State as AuthState } from './auth'
import { State as JoinState } from './join'
import { State as ProfileState } from './profile'
import { State as ScholarsState } from './scholars'
import { State as AboutState } from './about'
import { State as YearsState } from './years'

export interface RootState {
  auth: AuthState,
  join: JoinState,
  profile: ProfileState,
  scholars: ScholarsState,
  about: AboutState,
  years: YearsState
}

export const state = () => ({})
