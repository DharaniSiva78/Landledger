 let currentUser = null;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let properties = JSON.parse(localStorage.getItem('properties')) || [];
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let notaryDocs = JSON.parse(localStorage.getItem('notaryDocs')) || [];
        
        // Initialize the application
        function initApp() {
            // Check if user is logged in
            const loggedInUser = localStorage.getItem('currentUser');
            if (loggedInUser) {
                currentUser = JSON.parse(loggedInUser);
                updateAuthButtons();
            }
            
            // Generate sample data if none exists
            if (users.length === 0) {
                generateSampleData();
            }
            
            // Load user properties if logged in
            if (currentUser) {
                loadUserProperties();
                loadTransferProperties();
                loadNotaryProperties();
                loadTransactionHistory();
                loadNotaryHistory();
            }
        }
        
        // Generate sample data for demonstration
        function generateSampleData() {
            // Sample users
            users = [
                {
                    id: 1,
                    name: "John Doe",
                    email: "john@example.com",
                    password: "password123"
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    email: "jane@example.com",
                    password: "password123"
                }
            ];
            
            // Sample properties
            properties = [
                {
                    id: "PROP001",
                    address: "123 Main St, Bangalore, Karnataka",
                    area: 1800,
                    type: "residential",
                    ownerId: 1,
                    registrationDate: "2023-01-15",
                    documents: []
                },
                {
                    id: "PROP002",
                    address: "456 Oak Ave, Mumbai, Maharashtra",
                    area: 2400,
                    type: "commercial",
                    ownerId: 2,
                    registrationDate: "2023-02-20",
                    documents: []
                }
            ];
            
            // Sample transactions
            transactions = [
                {
                    id: "TXN001",
                    propertyId: "PROP001",
                    type: "registration",
                    from: "Government",
                    to: "John Doe",
                    date: "2023-01-15",
                    amount: 0,
                    timestamp: "2023-01-15T10:30:00Z"
                },
                {
                    id: "TXN002",
                    propertyId: "PROP002",
                    type: "registration",
                    from: "Government",
                    to: "Jane Smith",
                    date: "2023-02-20",
                    amount: 0,
                    timestamp: "2023-02-20T14:45:00Z"
                }
            ];
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('properties', JSON.stringify(properties));
            localStorage.setItem('transactions', JSON.stringify(transactions));
            localStorage.setItem('notaryDocs', JSON.stringify(notaryDocs));
        }
        
        // Show notification
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Show a specific page
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show the requested page
            document.getElementById(pageId).classList.add('active');
            
            // If user is not logged in, redirect to login for protected pages
            const protectedPages = ['profile', 'properties', 'transfer', 'notary', 'history'];
            if (!currentUser && protectedPages.includes(pageId)) {
                showPage('login');
                showNotification('Please login to access this page', 'error');
                return;
            }
            
            // Load data for specific pages
            if (currentUser) {
                if (pageId === 'profile') {
                    loadProfile();
                } else if (pageId === 'properties') {
                    loadProperties();
                } else if (pageId === 'history') {
                    loadTransactionHistory();
                } else if (pageId === 'notary') {
                    loadNotaryHistory();
                } else if (pageId === 'transfer') {
                    loadTransferProperties();
                }
            }
        }
        
        // Register a new user
        function register(event) {
            event.preventDefault();
            
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return false;
            }
            
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                showNotification('User with this email already exists', 'error');
                return false;
            }
            
            // Create new user
            const newUser = {
                id: users.length + 1,
                name,
                email,
                password
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showNotification('Registration successful! Please login.', 'success');
            showPage('login');
            return false;
        }
        
        // Login user
        function login(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateAuthButtons();
                showPage('home');
                showNotification('Login successful!', 'success');
            } else {
                showNotification('Invalid email or password', 'error');
            }
            
            return false;
        }
        
        // Logout user
        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthButtons();
            showPage('home');
            showNotification('Logged out successfully', 'success');
        }
        
        // Update authentication buttons based on login status
        function updateAuthButtons() {
            if (currentUser) {
                document.getElementById('loginBtn').style.display = 'none';
                document.getElementById('registerBtn').style.display = 'none';
                document.getElementById('logoutBtn').style.display = 'block';
                document.getElementById('profileBtn').style.display = 'block';
            } else {
                document.getElementById('loginBtn').style.display = 'block';
                document.getElementById('registerBtn').style.display = 'block';
                document.getElementById('logoutBtn').style.display = 'none';
                document.getElementById('profileBtn').style.display = 'none';
            }
        }
        
        // Load user profile
        function loadProfile() {
            document.getElementById('profileName').textContent = currentUser.name;
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileId').textContent = currentUser.id;
            
            loadUserProperties();
        }
        
        // Load user's properties
        function loadUserProperties() {
            const userProperties = properties.filter(prop => prop.ownerId === currentUser.id);
            const tbody = document.getElementById('userProperties');
            tbody.innerHTML = '';
            
            userProperties.forEach(prop => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prop.id}</td>
                    <td>${prop.address}</td>
                    <td>${prop.area}</td>
                    <td>${prop.registrationDate}</td>
                    <td>
                        <button class="btn btn-primary" onclick="generateQRCode('${prop.id}')">QR Code</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Register a new property
        function registerProperty(event) {
            event.preventDefault();
            
            const address = document.getElementById('propertyAddress').value;
            const area = document.getElementById('propertyArea').value;
            const type = document.getElementById('propertyType').value;
            
            // Generate property ID
            const propId = 'PROP' + String(properties.length + 1).padStart(3, '0');
            
            // Create new property
            const newProperty = {
                id: propId,
                address,
                area: parseInt(area),
                type,
                ownerId: currentUser.id,
                registrationDate: new Date().toISOString().split('T')[0],
                registrationTime: new Date().toLocaleTimeString(),
                documents: []
            };
            
            properties.push(newProperty);
            localStorage.setItem('properties', JSON.stringify(properties));
            
            // Create transaction record
            const newTransaction = {
                id: 'TXN' + String(transactions.length + 1).padStart(3, '0'),
                propertyId: propId,
                type: 'registration',
                from: 'Government',
                to: currentUser.name,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                amount: 0
            };
            
            transactions.push(newTransaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            showNotification('Property registered successfully!', 'success');
            document.getElementById('propertyForm').reset();
            loadProperties();
        }
        
        // Load properties for the properties page
        function loadProperties() {
            const userProperties = properties.filter(prop => prop.ownerId === currentUser.id);
            const propertiesList = document.getElementById('propertiesList');
            propertiesList.innerHTML = '';
            
            userProperties.forEach(prop => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${prop.id}</h3>
                    </div>
                    <div class="card-body">
                        <p><strong>Address:</strong> ${prop.address}</p>
                        <p><strong>Area:</strong> ${prop.area} sq ft</p>
                        <p><strong>Type:</strong> ${prop.type}</p>
                        <p><strong>Registered on:</strong> ${prop.registrationDate}</p>
                        <div style="text-align: center; margin-top: 15px;">
                            <button class="btn btn-primary" onclick="generateQRCode('${prop.id}')">Generate QR Code</button>
                            <button class="btn btn-outline" onclick="viewPropertyDetails('${prop.id}')" style="margin-left: 10px;">View Details</button>
                        </div>
                    </div>
                `;
                propertiesList.appendChild(card);
            });
        }
        
        // View property details
        function viewPropertyDetails(propertyId) {
            const property = properties.find(prop => prop.id === propertyId);
            if (!property) return;
            
            const owner = users.find(user => user.id === property.ownerId);
            
            // Create a modal for property details
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '15px';
            modalContent.style.maxWidth = '90%';
            modalContent.style.maxHeight = '90%';
            modalContent.style.overflowY = 'auto';
            
            modalContent.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 20px;">Property Details</h2>
                <div class="property-details">
                    <div class="detail-row">
                        <div class="detail-label">Property ID:</div>
                        <div class="detail-value">${property.id}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Address:</div>
                        <div class="detail-value">${property.address}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Area:</div>
                        <div class="detail-value">${property.area} sq ft</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Property Type:</div>
                        <div class="detail-value">${property.type}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Current Owner:</div>
                        <div class="detail-value">${owner ? owner.name : 'Unknown'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Registration Date:</div>
                        <div class="detail-value">${property.registrationDate}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Registration Time:</div>
                        <div class="detail-value">${property.registrationTime || 'N/A'}</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="printPropertyDetails()">Print Details</button>
                    <button class="btn btn-outline" onclick="this.closest('div').parentElement.parentElement.remove()" style="margin-left: 10px;">Close</button>
                </div>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
        
        // Print property details
        function printPropertyDetails() {
            window.print();
        }
        
        // Load properties for transfer dropdown
        function loadTransferProperties() {
            const userProperties = properties.filter(prop => prop.ownerId === currentUser.id);
            const dropdown = document.getElementById('transferProperty');
            dropdown.innerHTML = '<option value="">Select a property to transfer</option>';
            
            userProperties.forEach(prop => {
                const option = document.createElement('option');
                option.value = prop.id;
                option.textContent = `${prop.id} - ${prop.address}`;
                dropdown.appendChild(option);
            });
        }
        
        // Update transfer details when property is selected
        function updateTransferDetails() {
            const propertyId = document.getElementById('transferProperty').value;
            if (!propertyId) {
                document.getElementById('transferDetails').style.display = 'none';
                return;
            }
            
            const property = properties.find(prop => prop.id === propertyId);
            if (!property) return;
            
            const owner = users.find(user => user.id === property.ownerId);
            
            document.getElementById('currentOwner').textContent = owner ? owner.name : 'Unknown';
            document.getElementById('regDate').textContent = property.registrationDate;
            document.getElementById('transferDetails').style.display = 'block';
        }
        
        // Load properties for notary dropdown
        function loadNotaryProperties() {
            const userProperties = properties.filter(prop => prop.ownerId === currentUser.id);
            const dropdown = document.getElementById('notaryProperty');
            dropdown.innerHTML = '<option value="">Select a property</option>';
            
            userProperties.forEach(prop => {
                const option = document.createElement('option');
                option.value = prop.id;
                option.textContent = `${prop.id} - ${prop.address}`;
                dropdown.appendChild(option);
            });
        }
        
        // Toggle verify method
        function toggleVerifyMethod() {
            const method = document.getElementById('verifyMethod').value;
            document.getElementById('verifyIdGroup').style.display = method === 'id' ? 'block' : 'none';
            document.getElementById('verifyAddressGroup').style.display = method === 'address' ? 'block' : 'none';
            document.getElementById('verifyQrGroup').style.display = method === 'qr' ? 'block' : 'none';
        }
        
        // Verify property
        function verifyProperty(event) {
            event.preventDefault();
            
            const method = document.getElementById('verifyMethod').value;
            let property;
            
            if (method === 'id') {
                const propId = document.getElementById('propertyId').value;
                property = properties.find(prop => prop.id === propId);
            } else if (method === 'address') {
                const address = document.getElementById('verifyAddress').value;
                property = properties.find(prop => prop.address.toLowerCase().includes(address.toLowerCase()));
            } else {
                // In a real app, this would use a QR scanner
                showNotification('QR scanning functionality would be implemented in a real app', 'info');
                return false;
            }
            
            if (property) {
                const owner = users.find(user => user.id === property.ownerId);
                document.getElementById('verifyPropId').textContent = property.id;
                document.getElementById('verifyAddressResult').textContent = property.address;
                document.getElementById('verifyArea').textContent = property.area + ' sq ft';
                document.getElementById('verifyType').textContent = property.type;
                document.getElementById('verifyOwner').textContent = owner ? owner.name : 'Unknown';
                document.getElementById('verifyRegDate').textContent = property.registrationDate;
                document.getElementById('verifyStatus').textContent = 'Verified';
                document.getElementById('verifyStatus').style.color = 'var(--success)';
                document.getElementById('verificationResult').style.display = 'block';
            } else {
                showNotification('Property not found', 'error');
            }
            
            return false;
        }
        
        // Scan QR code (simulated)
        function scanQRCode() {
            showNotification('QR scanning functionality would be implemented in a real app', 'info');
        }
        
        // Generate QR code for a property - FIXED VERSION
        function generateQRCode(propertyId) {
            const property = properties.find(prop => prop.id === propertyId);
            if (!property) return;
            
            const owner = users.find(user => user.id === property.ownerId);
            
            // Create a modal for QR code
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '15px';
            modalContent.style.textAlign = 'center';
            modalContent.style.maxWidth = '90%';
            
            modalContent.innerHTML = `
                <h2>Property QR Code</h2>
                <p>${property.id} - ${property.address}</p>
                <div id="qrcode-container"></div>
                <p style="margin-top: 15px;">Scan this code to verify property details</p>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="this.closest('div').parentElement.remove()">Close</button>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Generate QR code - FIXED IMPLEMENTATION
            const qrElement = document.getElementById('qrcode-container');
            qrElement.innerHTML = '';
            
            // Create a canvas element for the QR code
            const canvas = document.createElement('canvas');
            qrElement.appendChild(canvas);
            
            // Generate the QR code
            QRCode.toCanvas(canvas, 
                `LandLedger Property Verification\nID: ${property.id}\nAddress: ${property.address}\nOwner: ${owner.name}\nArea: ${property.area} sq ft\nType: ${property.type}`, 
                { width: 200 }, 
                function(error) {
                    if (error) {
                        console.error(error);
                        showNotification('Error generating QR code', 'error');
                    }
                }
            );
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
        
        // Transfer ownership
        function transferOwnership(event) {
            event.preventDefault();
            
            const propertyId = document.getElementById('transferProperty').value;
            const newOwnerEmail = document.getElementById('newOwnerEmail').value;
            const amount = document.getElementById('transferAmount').value;
            
            // Find property and new owner
            const property = properties.find(prop => prop.id === propertyId);
            const newOwner = users.find(user => user.email === newOwnerEmail);
            
            if (!property) {
                showNotification('Property not found', 'error');
                return false;
            }
            
            if (!newOwner) {
                showNotification('User with this email not found', 'error');
                return false;
            }
            
            if (property.ownerId === newOwner.id) {
                showNotification('You cannot transfer property to yourself', 'error');
                return false;
            }
            
            // Update property ownership
            const oldOwnerId = property.ownerId;
            const oldOwner = users.find(user => user.id === oldOwnerId);
            property.ownerId = newOwner.id;
            property.transferDate = new Date().toISOString().split('T')[0];
            property.transferTime = new Date().toLocaleTimeString();
            localStorage.setItem('properties', JSON.stringify(properties));
            
            // Create transaction record
            const newTransaction = {
                id: 'TXN' + String(transactions.length + 1).padStart(3, '0'),
                propertyId: propertyId,
                type: 'transfer',
                from: oldOwner.name,
                to: newOwner.name,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                amount: parseFloat(amount)
            };
            
            transactions.push(newTransaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            showNotification('Ownership transfer initiated successfully!', 'success');
            document.getElementById('transferForm').reset();
            document.getElementById('transferDetails').style.display = 'none';
            loadTransferProperties();
            loadTransactionHistory();
            
            return false;
        }
        
        // Notarize document
        function notarizeDocument(event) {
            event.preventDefault();
            
            const propertyId = document.getElementById('notaryProperty').value;
            const docType = document.getElementById('notaryDocType').value;
            const notes = document.getElementById('notaryNotes').value;
            
            // Find property
            const property = properties.find(prop => prop.id === propertyId);
            if (!property) {
                showNotification('Property not found', 'error');
                return false;
            }
            
            // Create notary document record
            const newNotaryDoc = {
                id: 'DOC' + String(notaryDocs.length + 1).padStart(3, '0'),
                propertyId: propertyId,
                type: docType,
                ownerId: currentUser.id,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                status: 'Notarized',
                notes: notes
            };
            
            notaryDocs.push(newNotaryDoc);
            localStorage.setItem('notaryDocs', JSON.stringify(notaryDocs));
            
            showNotification('Document submitted for notarization successfully!', 'success');
            document.getElementById('notaryForm').reset();
            loadNotaryHistory();
            
            return false;
        }
        
        // Load transaction history
        function loadTransactionHistory() {
            const userProperties = properties.filter(prop => prop.ownerId === currentUser.id);
            const userTransactions = transactions.filter(txn => 
                userProperties.some(prop => prop.id === txn.propertyId)
            );
            
            const tbody = document.getElementById('transactionHistory');
            tbody.innerHTML = '';
            
            userTransactions.forEach(txn => {
                const date = new Date(txn.timestamp);
                const formattedTime = date.toLocaleTimeString();
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${txn.id}</td>
                    <td>${txn.propertyId}</td>
                    <td>${txn.type}</td>
                    <td>${txn.from}</td>
                    <td>${txn.to}</td>
                    <td>${txn.date}</td>
                    <td>${txn.amount ? '₹' + txn.amount : 'N/A'}</td>
                    <td>${formattedTime}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Load notary history
        function loadNotaryHistory() {
            const userNotaryDocs = notaryDocs.filter(doc => doc.ownerId === currentUser.id);
            const tbody = document.getElementById('notaryHistory');
            tbody.innerHTML = '';
            
            userNotaryDocs.forEach(doc => {
                const property = properties.find(prop => prop.id === doc.propertyId);
                const date = new Date(doc.timestamp);
                const formattedDate = date.toLocaleDateString();
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${property ? property.address : 'Unknown'}</td>
                    <td>${doc.type}</td>
                    <td>${formattedDate}</td>
                    <td>${doc.status}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Initialize the app when the page loads
        window.onload = initApp;