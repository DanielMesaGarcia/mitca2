import axios from 'axios';
import {
    regSw,
    subscribe,
    unregisterAllServiceWorkers,
    checkIfAlreadySubscribed,
    getAllSubscriptions,
    sendNotificationToSubscriptionName,
    unregisterFromServiceWorker
} from '../../services/helper';

const API_URL = process.env.REACT_APP_API_URL;
const API = API_URL + '/subscriptions';

// Mock axios
jest.mock('axios');

describe('Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('registers service worker successfully', async () => {
        const mockReg = { scope: '/' };
        navigator.serviceWorker.register = jest.fn().mockResolvedValueOnce(mockReg);

        const reg = await regSw();

        expect(reg).toEqual(mockReg);
        expect(navigator.serviceWorker.register).toHaveBeenCalled();
    });

    it('throws error if service worker is not supported', async () => {
        navigator.serviceWorker.register = jest.fn();

        await expect(regSw()).rejects.toThrowError('serviceworker not supported');
        expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
    });

    it('subscribes successfully', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce(null),
                subscribe: jest.fn().mockResolvedValueOnce('mockSubscription')
            }
        };
        const subscriptionName = 'TestSubscription';
        axios.post.mockResolvedValueOnce({});

        const response = await subscribe(serviceWorkerReg, subscriptionName);

        expect(response).toEqual({});
        expect(serviceWorkerReg.pushManager.subscribe).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(`${API}/subscribe`, {
            subscriptionName: subscriptionName,
            subscription: 'mockSubscription'
        });
    });

    it('does not subscribe if already subscribed', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce('mockSubscription')
            }
        };

        const response = await subscribe(serviceWorkerReg, 'TestSubscription');

        expect(response).toBeUndefined();
        expect(serviceWorkerReg.pushManager.subscribe).not.toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('checks if already subscribed successfully', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce('mockSubscription')
            }
        };

        const isSubscribed = await checkIfAlreadySubscribed(serviceWorkerReg);

        expect(isSubscribed).toBe(true);
        expect(serviceWorkerReg.pushManager.getSubscription).toHaveBeenCalled();
    });

    it('checks if not subscribed successfully', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce(null)
            }
        };

        const isSubscribed = await checkIfAlreadySubscribed(serviceWorkerReg);

        expect(isSubscribed).toBe(false);
        expect(serviceWorkerReg.pushManager.getSubscription).toHaveBeenCalled();
    });

    describe('Service', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('gets all subscriptions successfully', async () => {
            axios.get.mockResolvedValueOnce({ data: 'subscriptions' });

            const subscriptions = await getAllSubscriptions();

            expect(subscriptions).toEqual('subscriptions');
            expect(axios.get).toHaveBeenCalledWith(`${API}`);
        });

        it('sends notification to subscription name successfully', async () => {
            axios.post.mockResolvedValueOnce({});

            const response = await sendNotificationToSubscriptionName('TestSubscription', 'Hello');

            expect(response).toEqual({});
            expect(axios.post).toHaveBeenCalledWith(`${API}/sendNotificationToSubscriptionName`, {
                subscriptionName: 'TestSubscription',
                notificationMessage: 'Hello'
            });
        });

        it('unregisters all service workers successfully', async () => {
            const mockRegistration = { unregister: jest.fn() };
            navigator.serviceWorker.getRegistrations = jest.fn().mockResolvedValueOnce([mockRegistration]);

            await unregisterAllServiceWorkers();

            expect(mockRegistration.unregister).toHaveBeenCalled();
        });

        it('unregisters from service worker successfully', async () => {
            const mockRegistration = { pushManager: { getSubscription: jest.fn().mockResolvedValueOnce(null) } };
            navigator.serviceWorker.getRegistration = jest.fn().mockResolvedValueOnce(mockRegistration);
            axios.post.mockResolvedValueOnce({});
            const mockSubscription = { unsubscribe: jest.fn() };

            await unregisterFromServiceWorker();

            expect(axios.post).not.toHaveBeenCalled(); // No debería llamar al endpoint si no hay suscripción
            expect(mockSubscription.unsubscribe).not.toHaveBeenCalled(); // No debería intentar desuscribirse si no hay suscripción
        });
    });
    it('subscribes successfully when subscription is null', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce(null),
                subscribe: jest.fn().mockResolvedValueOnce('mockSubscription')
            }
        };
        const subscriptionName = 'TestSubscription';
        axios.post.mockResolvedValueOnce({});

        const response = await subscribe(serviceWorkerReg, subscriptionName);

        expect(response).toEqual({});
        expect(serviceWorkerReg.pushManager.subscribe).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(`${API}/subscribe`, {
            subscriptionName: subscriptionName,
            subscription: 'mockSubscription'
        });
    });

    it('does not subscribe if subscription is not null', async () => {
        const serviceWorkerReg = {
            pushManager: {
                getSubscription: jest.fn().mockResolvedValueOnce('mockSubscription')
            }
        };

        const response = await subscribe(serviceWorkerReg, 'TestSubscription');

        expect(response).toBeUndefined();
        expect(serviceWorkerReg.pushManager.subscribe).not.toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('gets all subscriptions successfully', async () => {
        const expectedSubscriptions = ['subscription1', 'subscription2'];
        axios.get.mockResolvedValueOnce({ data: expectedSubscriptions });

        const subscriptions = await getAllSubscriptions();

        expect(subscriptions).toEqual(expectedSubscriptions);
        expect(axios.get).toHaveBeenCalledWith(`${API}`);
    });
});
