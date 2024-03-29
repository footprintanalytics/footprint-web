export type UserId = number;

export interface BaseUser {
  id: UserId;
  first_name: string | null;
  last_name: string | null;
  common_name: string;
  email: string;
  locale: string | null;
  google_auth: boolean;
  is_active: boolean;
  is_qbnewb: boolean;
  is_superuser: boolean;

  date_joined: string;
  last_login: string;
  first_login: string;
}

export interface User extends BaseUser {
  google_auth: boolean;
  login_attributes: string[] | null;
  is_installer: boolean;
  has_invited_second_user: boolean;
  has_question_and_dashboard: boolean;
  personal_collection_id: number;
  vipInfo: any;
  name: string;
}
export interface FgaProject {
  id: number;
  protocolName: string;
  protocolSlug: string;
  nftCollectionAddress: ContractAddress[] | null;
  tokenAddress: ContractAddress[] | null;
  protocolType: string;
  logo: string;
  twitter: Twitter | null;
  discord: Discord | null;
  ga: Ga | null;
}
interface Ga {
  sourceDefinitionId: string;
}
interface Discord {
  guildId: string;
  guildName: string;
  sourceDefinitionId: string;
}
interface Twitter {
  handler: string;
  sourceDefinitionId: string;
}
interface ContractAddress {
  address: string;
  chain: string;
}

