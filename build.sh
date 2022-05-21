echo "--Frontend Install--"
cd frontend \
    && npm install \
    && npx prisma generate \
    && npm run build \
&& echo "--Backend Install--" \
&& cd ../backend \
    && npm install \
    && npx prisma generate \
    && npm run build \
    && cd ../

function runServers(){
    cd frontend && npm start & 
    cd backend && npm start &
    wait
}
echo "--Running Servers--" \
    && runServers