import {useEffect,useRef,useState} from 'react';
import {NearConnector} from '@hot-labs/near-connect';
import {Wallet,LoaderCircle} from 'lucide-react';
export default function NearWalletButton({onAccount}:{onAccount:(account:string)=>void}){
 const connector=useRef<any>(null),[busy,setBusy]=useState(false),[connected,setConnected]=useState(false),[error,setError]=useState('');
 if(!connector.current)connector.current=new NearConnector({features:{testnet:true}});
 useEffect(()=>{const c=connector.current;c.on('wallet:signIn',(event:any)=>{const id=event.accounts?.[0]?.accountId;if(id){onAccount(id);setConnected(true);setError('');}});c.on('wallet:signOut',()=>{onAccount('');setConnected(false);});},[onAccount]);
 const connect=async()=>{setBusy(true);setError('');try{await connector.current.connect();}catch(e){setError(e instanceof Error?e.message:'Could not connect wallet.');}finally{setBusy(false);}};
 return <span className="wallet-connect-wrap"><button className="wallet-connect" onClick={connect} disabled={busy}>{busy?<LoaderCircle size={13}/>:<Wallet size={13}/>} {busy?'Connecting…':connected?'Wallet connected':'Connect NEAR wallet'}</button>{error&&<small className="wallet-error">{error}</small>}</span>;
}
