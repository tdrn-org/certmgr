import { KeyUsageSpec, BasicConstraintsSpec, ExtKeyUsageSpec, Entry } from "./api";

function checkValidTo(date: Date): 'valid' | 'expiring' | 'expired' {
    const now = Date.now();
    if (date.getTime() < now) {
        return 'expired';
    }
    if (date.getTime() < now + 7 * 24 * 60 * 60 * 1000) {
        return 'expiring';
    }
    return 'valid';
}

function isLocalCa(ca: string): boolean {
    return ca == 'Local';
}

function isRemoteCa(ca: string): boolean {
    return ca == 'Remote';
}

function isAcmeCa(ca: string): boolean {
    return (ca ?? '').startsWith('ACME:');
}

const defaultKeyTypes: string[] = [
    'ECDSA224',
    'ECDSA256',
    'ECDSA384',
    'ECDSA521',
    'ED25519',
    'RSA2048',
    'RSA3072',
    'RSA4096',
    'RSA8192',
];

const acmeKeyTypes: string[] = [
    'ECDSA256',
    'ECDSA384',
    'RSA2048',
    'RSA3072',
    'RSA4096',
];

export enum KeyUsageFlag {
    DigitalSignature = 1,
    ContentCommitment = 2,
    KeyEncipherment = 4,
    DataEncipherment = 8,
    KeyAgreement = 16,
    KeyCertSign = 32,
    CRLSign = 64,
    EncipherOnly = 128,
    DecipherOnly = 256,
}

export class KeyUsage {
    digitalSignature: boolean = false;
    contentCommitment: boolean = false;
    keyEncipherment: boolean = false;
    dataEncipherment: boolean = false;
    keyAgreement: boolean = false;
    keyCertSign: boolean = false;
    crlSign: boolean = false;
    encipherOnly: boolean = false;
    decipherOnly: boolean = false;

    fromFlag(flag: number) {
        this.digitalSignature = (flag & KeyUsageFlag.DigitalSignature) != 0;
        this.contentCommitment = (flag & KeyUsageFlag.ContentCommitment) != 0;
        this.keyEncipherment = (flag & KeyUsageFlag.KeyEncipherment) != 0;
        this.dataEncipherment = (flag & KeyUsageFlag.DataEncipherment) != 0;
        this.keyAgreement = (flag & KeyUsageFlag.KeyAgreement) != 0;
        this.keyCertSign = (flag & KeyUsageFlag.KeyCertSign) != 0;
        this.crlSign = (flag & KeyUsageFlag.CRLSign) != 0;
        this.encipherOnly = (flag & KeyUsageFlag.EncipherOnly) != 0;
        this.decipherOnly = (flag & KeyUsageFlag.DecipherOnly) != 0;
    }

    fromSpec(spec: KeyUsageSpec) {
        this.fromFlag(spec.keyUsage)
    }

    toFlag(): number {
        let flag: number = 0;
        if (this.digitalSignature) {
            flag |= KeyUsageFlag.DigitalSignature;
        }
        if (this.contentCommitment) {
            flag |= KeyUsageFlag.ContentCommitment;
        }
        if (this.keyEncipherment) {
            flag |= KeyUsageFlag.KeyEncipherment;
        }
        if (this.dataEncipherment) {
            flag |= KeyUsageFlag.DataEncipherment;
        }
        if (this.keyAgreement) {
            flag |= KeyUsageFlag.KeyAgreement;
        }
        if (this.keyCertSign) {
            flag |= KeyUsageFlag.KeyCertSign;
        }
        if (this.crlSign) {
            flag |= KeyUsageFlag.CRLSign;
        }
        if (this.encipherOnly) {
            flag |= KeyUsageFlag.EncipherOnly;
        }
        if (this.decipherOnly) {
            flag |= KeyUsageFlag.DecipherOnly;
        }
        return flag;
    }

    toSpec(): KeyUsageSpec {
        let spec = new KeyUsageSpec();
        spec.enabled = true;
        spec.keyUsage = this.toFlag();
        return spec;
    }
}

export class ExtKeyUsage {
    any: boolean = false;
    serverAuth: boolean = false;
    clientAuth: boolean = false;
    codeSigning: boolean = false;
    emailProtection: boolean = false;
    ipsecEndSystem: boolean = false;
    ipsecTunnel: boolean = false;
    ipsecUser: boolean = false;
    timeStamping: boolean = false;
    ocspSigning: boolean = false;
    microsoftServerGatedCrypto: boolean = false;
    netscapeServerGatedCrypto: boolean = false;
    microsoftCommercialCodeSigning: boolean = false;
    microsoftKernelCodeSigning: boolean = false;

    fromSpec(spec: ExtKeyUsageSpec) {
        this.any = spec.any;
        this.serverAuth = spec.serverAuth;
        this.clientAuth = spec.clientAuth;
        this.codeSigning = spec.codeSigning;
        this.emailProtection = spec.emailProtection;
        this.ipsecEndSystem = spec.ipsecEndSystem;
        this.ipsecTunnel = spec.ipsecTunnel
        this.ipsecUser = spec.ipsecUser
        this.timeStamping = spec.timeStamping;
        this.ocspSigning = spec.ocspSigning;
        this.microsoftServerGatedCrypto = spec.microsoftServerGatedCrypto;
        this.netscapeServerGatedCrypto = spec.netscapeServerGatedCrypto;
        this.microsoftCommercialCodeSigning = spec.microsoftCommercialCodeSigning;
        this.microsoftKernelCodeSigning = spec.microsoftKernelCodeSigning;
    }

    toSpec(): ExtKeyUsageSpec {
        let spec = new ExtKeyUsageSpec();
        spec.enabled = true;
        spec.any = this.any;
        spec.serverAuth = this.serverAuth;
        spec.clientAuth = this.clientAuth;
        spec.codeSigning = this.codeSigning;
        spec.emailProtection = this.emailProtection;
        spec.ipsecEndSystem = this.ipsecEndSystem;
        spec.ipsecTunnel = this.ipsecTunnel;
        spec.ipsecUser = this.ipsecUser;
        spec.timeStamping = this.timeStamping;
        spec.ocspSigning = this.ocspSigning;
        spec.microsoftServerGatedCrypto = this.microsoftServerGatedCrypto;
        spec.netscapeServerGatedCrypto = this.netscapeServerGatedCrypto;
        spec.microsoftCommercialCodeSigning = this.microsoftCommercialCodeSigning;
        spec.microsoftKernelCodeSigning = this.microsoftKernelCodeSigning;
        return spec;
    }
}

export class BasicConstraints {
    ca: boolean = false;
    pathLenConstraint: number = -1;

    fromSpec(spec: BasicConstraintsSpec) {
        this.ca = spec.ca;
        this.pathLenConstraint = spec.pathLenConstraint;
    }

    toSpec(): BasicConstraintsSpec {
        let spec = new BasicConstraintsSpec();
        spec.enabled = true;
        spec.ca = this.ca;
        spec.pathLenConstraint = this.pathLenConstraint;
        return spec;
    }
}

const certs = {
    checkValidTo,
    isLocalCa,
    isRemoteCa,
    isAcmeCa,
    defaultKeyTypes,
    acmeKeyTypes,
};

export default certs;