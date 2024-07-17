import { fetchUser, getActivity } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  //getActivities
  const activity = await getActivity(userInfo._id);

  // Function to format date and time
  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${hours}.${minutes} · ${day}/${month}/${year}`;
  };

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-2">
                    <Image
                      src={activity.author.image}
                      alt="Profile Image"
                      width={20}
                      height={20}
                      className="object-cover rounded-full"
                    />

                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-purple-400">
                        {activity.author.name}
                      </span>{' '}
                      replied to your thread
                    </p>
                  </div>
                  <div>
                    <p className="!text-small-regular text-light-4">
                      {formatDateTime(activity.createAt)}
                    </p>
                  </div>

                  {/* <p>{activity.createAt.toString()}</p> */}
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
